import React from "react";
import { useContractReader } from "../../../../../hooks";
import { EditSplit } from "../EditSplit";
import { ViewSplit } from "../ViewSplit";

const SplitContainer = ({ readContracts, writeContracts, tx, mainnetProvider }) => {
  const activeSplitAccounts = useContractReader(readContracts, "DistributingTreaty", "getSplitAccounts");
  const activeSplit = useContractReader(readContracts, "DistributingTreaty", "getSplit");
  const proposedSplitAccounts = useContractReader(readContracts, "DistributingTreaty", "getProposedSplitAccounts");
  const proposedSplit = useContractReader(readContracts, "DistributingTreaty", "getProposedSplit");
  const lastHash = useContractReader(readContracts, "DistributingTreaty", "getLastUnsignedHash");
  console.log("proposedSplit :>> ", proposedSplit);
  console.log("proposedSplitAccounts :>> ", proposedSplitAccounts);
  console.log("activeSplit :>> ", activeSplit);
  console.log("activeSplitAccounts :>> ", activeSplitAccounts);
  console.log("readContracts :>> ", readContracts);

  return (
    <div style={{ display: "flex" }}>
      <div id="activesplitcontainer" style={{ flex: "1" }}>
        <h3>Active Distribution</h3>
        <ViewSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider} />
      </div>
      <div id="proposedsplitcontainer" style={{ flex: "1" }}>
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
