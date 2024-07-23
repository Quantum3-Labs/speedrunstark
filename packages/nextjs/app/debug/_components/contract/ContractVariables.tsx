import { Abi } from "abi-wan-kanabi";
import {
  Contract,
  ContractName,
  getFunctionsByStateMutability,
} from "~~/utils/scaffold-stark/contract";
import { DisplayVariable } from "./DisplayVariable";

export const ContractVariables = ({
  refreshDisplayVariables,
  deployedContractData,
}: {
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = getFunctionsByStateMutability(
    (deployedContractData.abi || []) as Abi,
    "view",
  )
    .filter((fn) => {
      const isQueryableWithParams = fn.inputs.length === 0;
      return isQueryableWithParams;
    })
    .map((fn) => {
      return {
        fn,
      };
    });
  if (!functionsToDisplay.length) {
    return <span className="text-neutral">No contract variables</span>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn }) => (
        <DisplayVariable
          abi={deployedContractData.abi as Abi}
          abiFunction={fn}
          contractAddress={deployedContractData.address}
          key={fn.name}
          refreshDisplayVariables={refreshDisplayVariables}
          //   inheritedFrom={inheritedFrom}
        />
      ))}
    </>
  );
};
