"use client";

import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-stark";
// import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark";

const Transfers: NextPage = () => {
  //   const { data: transferEvents, isLoading } = useScaffoldEventHistory({
  //     contractName: "YourCollectible",
  //     eventName: "Transfer",
  //     // Specify the starting block number from which to read events, this is a bigint.
  //     fromBlock: 0n,
  //   });

  //   if (isLoading)
  //     return (
  //       <div className="flex justify-center items-center mt-10">
  //         <span className="loading loading-spinner loading-xl"></span>
  //       </div>
  //     );

  const transferEvents = [
    {
      address: "0x7f982E4f614167DfC7950fdA06e920b9E2514748",
    },
  ];

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">
              All Transfers Events
            </span>
          </h1>
        </div>
        <div className="overflow-x-auto shadow-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="bg-primary text-white">Token Id</th>
                <th className="bg-primary text-white">From</th>
                <th className="bg-primary text-white">To</th>
              </tr>
            </thead>
            <tbody>
              {!transferEvents || transferEvents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    No events found
                  </td>
                </tr>
              ) : (
                transferEvents?.map((event, index) => {
                  return (
                    <tr key={index}>
                      {/* <th className="text-center">{event.args.tokenId?.toString()}</th> */}
                      <td>{/* <Address address={event.args.from} /> */}</td>
                      <td>{/* <Address address={event.args.to} /> */}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Transfers;