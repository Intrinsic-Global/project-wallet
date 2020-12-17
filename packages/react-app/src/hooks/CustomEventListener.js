import { useState, useEffect, useCallback } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

export default function useCustomerEventListener(contract, eventName, provider, startBlock) {
  const [updates, setUpdates] = useState([]);

  const addNewEvent = useCallback((...eventArgs) => {
    let blockNumber = eventArgs[eventArgs.length - 1].blockNumber;
    setUpdates(messages => [Object.assign({ blockNumber }, eventArgs.pop().args), ...messages]);
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof provider !== "undefined" && typeof startBlock !== "undefined") {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock);
    }
    if (contract) {
      try {
        contract.on(eventName, addNewEvent);
        return () => {
          contract.off(eventName, addNewEvent);
        };
      } catch (e) {
        // Event "eventName" may not exist on contract
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  }, [provider, contract, eventName, startBlock, addNewEvent]);

  return updates;
}
