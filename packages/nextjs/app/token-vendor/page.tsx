"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { AddressInput } from "~~/components/scaffold-stark/Input/AddressInput";
import { IntegerInput } from "~~/components/scaffold-stark/Input/IntegerInput";
import { useScaffoldContractRead } from "~~/hooks/scaffold-stark/useScaffoldContractRead";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-stark/useScaffoldContractWrite";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useScaffoldMultiContractWrite } from "~~/hooks/scaffold-stark/useScaffoldMultiContractWrite";
import { useBalance } from "@starknet-react/core";
import { formatEther } from "ethers";
import { multiplyTo1e18 } from "~~/utils/scaffold-stark/priceInWei";

const TokenVendor: NextPage = () => {
  const [toAddress, setToAddress] = useState("");
  const [tokensToSend, setTokensToSend] = useState("");
  const [tokensToBuy, setTokensToBuy] = useState<string | bigint>("");
  const [isApproved, setIsApproved] = useState(false);
  const [tokensToSell, setTokensToSell] = useState<string>("");

  const { address: connectedAddress } = useAccount();

  const { data: yourTokenBalance } = useScaffoldContractRead({
    contractName: "YourToken",
    functionName: "balance_of",
    args: [connectedAddress ?? ""],
  });

  const { data: tokensPerEth } = useScaffoldContractRead({
    contractName: "Vendor",
    functionName: "tokens_per_eth",
  });

  const { writeAsync: transferTokens } = useScaffoldContractWrite({
    contractName: "YourToken",
    functionName: "transfer",
    args: [toAddress, multiplyTo1e18(tokensToSend)],
  });

  // // Vendor Balances
  const { data: vendorContractData } = useDeployedContractInfo("Vendor");

  const { data: vendorTokenBalance } = useScaffoldContractRead({
    contractName: "YourToken",
    functionName: "balance_of",
    args: [vendorContractData?.address],
  });

  const { data: vendorContractBalance } = useBalance({
    address: vendorContractData?.address,
  });

  const { writeAsync: buy } = useScaffoldMultiContractWrite({
    calls: [
      {
        contractName: "Eth",
        functionName: "approve",
        args: [vendorContractData?.address ?? "", multiplyTo1e18(tokensToBuy)],
      },
      {
        contractName: "Vendor",
        functionName: "buy_tokens",
        args: [multiplyTo1e18(tokensToBuy)],
      },
    ],
  });

  const { writeAsync: sell } = useScaffoldMultiContractWrite({
    calls: [
      {
        contractName: "YourToken",
        functionName: "approve",
        args: [vendorContractData?.address ?? "", multiplyTo1e18(tokensToSell)],
      },
      {
        contractName: "Vendor",
        functionName: "sell_tokens",
        args: [multiplyTo1e18(tokensToSell)],
      },
    ],
  });

  const wrapInTryCatch =
    (fn: () => Promise<any>, errorMessageFnDescription: string) => async () => {
      try {
        await fn();
      } catch (error) {
        console.error(
          `Error calling ${errorMessageFnDescription} function`,
          error,
        );
      }
    };

  return (
    <>
      <div className="flex items-center flex-col flex-grow py-10">
        <div className="flex flex-col items-center bg-base-100 border-8 border-secondary rounded-xl p-6 mt-24 w-full max-w-lg">
          <div className="text-xl">
            Your token balance:{" "}
            <div className="inline-flex items-center justify-center">
              <span className="font-bold ml-1">
                {parseFloat(formatEther(yourTokenBalance || 0n))}
              </span>
            </div>
          </div>
          {/* Vendor Balances */}
          <hr className="w-full border-secondary my-3" />
          <div>
            Vendor token balance:{" "}
            <div className="inline-flex items-center justify-center">
              {parseFloat(formatEther(vendorTokenBalance || 0n)).toFixed(4)}
              <span className="font-bold ml-1"> </span>
            </div>
          </div>
          <div>
            Vendor eth balance:
            <span className="px-1">{vendorContractBalance?.formatted}</span>
            <span className="font-bold ml-1">
              {vendorContractBalance?.symbol}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 bg-base-100 border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">Transfer tokens</div>
          <div className="w-full flex flex-col space-y-2">
            <AddressInput
              placeholder="to address"
              value={toAddress}
              onChange={(value) => setToAddress(value)}
            />
            <IntegerInput
              placeholder="amount of tokens to send"
              value={tokensToSend}
              onChange={(value) => setTokensToSend(value as string)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary"
            onClick={wrapInTryCatch(transferTokens, "transferTokens")}
          >
            Send Tokens
          </button>
        </div>

        {/* Buy Tokens  */}
        <div className="flex flex-col items-center space-y-4 bg-base-100 border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">Buy tokens</div>
          <div>{Number(tokensPerEth)} tokens per ETH</div>

          <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of tokens to buy"
              value={tokensToBuy.toString()}
              onChange={(value) => setTokensToBuy(value)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary mt-2"
            onClick={wrapInTryCatch(buy, "buyTokens")}
          >
            Buy Tokens
          </button>
        </div>

        {/* Sell Tokens */}

        <div className="flex flex-col items-center space-y-4 bg-base-100 border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">Sell tokens</div>
          <div>{Number(tokensPerEth)} tokens per ETH</div>
          <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of tokens to sell"
              value={tokensToSell}
              onChange={(value) => setTokensToSell(value as string)}
              disabled={isApproved}
              disableMultiplyBy1e18
            />
          </div>

          <div className="flex gap-4">
            <button
              className="btn btn-secondary mt-2"
              onClick={wrapInTryCatch(sell, "sellTokens")}
            >
              Sell Tokens
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenVendor;