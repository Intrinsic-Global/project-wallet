import React from "react";
import { useCustomContractReader } from "../../../../../hooks";
import { EditSplit } from "../EditSplit";
import { ViewSplit } from "../ViewSplit";

const SplitContainer = ({ contract, writeContracts, tx, mainnetProvider }) => {
  const activeSplitAccounts = useCustomContractReader(contract, "getSplitAccounts");
  const activeSplit = useCustomContractReader(contract, "getSplit");
  const proposedSplitAccounts = useCustomContractReader(contract, "getProposedSplitAccounts");
  const proposedSplit = useCustomContractReader(contract, "getProposedSplit");
  const lastHash = useCustomContractReader(contract, "getLastUnsignedHash");
  console.log("proposedSplit :>> ", proposedSplit);
  console.log("proposedSplitAccounts :>> ", proposedSplitAccounts);
  console.log("activeSplit :>> ", activeSplit);
  console.log("activeSplitAccounts :>> ", activeSplitAccounts);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div id="activesplitcontainer" style={{ flex: "1 0 200px", margin: "0 10px" }}>
        <h3>Active Distribution</h3>
        <ViewSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider} />
      </div>
      <div id="proposedsplitcontainer" style={{ flex: "1 0 200px", margin: "0 10px" }}>
        <h3>Proposed Distribution</h3>
        <EditSplit
          tx={tx}
          writeContracts={writeContracts}
          lastHash={lastHash}
          splitAccounts={proposedSplitAccounts}
          split={proposedSplit}
          mainnetProvider={mainnetProvider}
        />
      </div>
    </div>
  );
};

export default SplitContainer;
