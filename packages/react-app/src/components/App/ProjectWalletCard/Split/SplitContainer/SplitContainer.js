import React from "react";
import { useContractReader } from "../../../../../hooks";
import { EditSplit } from "../EditSplit";
import { ViewSplit } from "../ViewSplit";

const SplitContainer = ({ readContracts, projectWalletService, mainnetProvider }) => {
  const activeSplitAccounts = useContractReader(readContracts, "DistributingTreaty", "getSplitAccounts");
  const activeSplit = useContractReader(readContracts, "DistributingTreaty", "getSplit");
  const proposedSplitAccounts = useContractReader(
    readContracts,
    "DistributingTreaty",
    "getProposedSplitAccounts",
    999999999,
  );
  const proposedSplit = useContractReader(readContracts, "DistributingTreaty", "getProposedSplit", [], 999999999);
  const lastHash = useContractReader(readContracts, "DistributingTreaty", "getLastUnsignedHash");
  // console.log("proposedSplit :>> ", proposedSplit);
  // console.log("proposedSplitAccounts :>> ", proposedSplitAccounts);
  // console.log("activeSplit :>> ", activeSplit);
  // console.log("activeSplitAccounts :>> ", activeSplitAccounts);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div id="activesplitcontainer" style={{ flex: "1 0 200px", margin: "0 10px" }}>
        <h3>Active Distribution</h3>
        {activeSplit !== undefined && activeSplitAccounts !== undefined && (
          <ViewSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider} />
        )}
      </div>
      <div id="proposedsplitcontainer" style={{ flex: "1 0 200px", margin: "0 10px" }}>
        <h3>Proposed Distribution</h3>
        {proposedSplit !== undefined && proposedSplitAccounts !== undefined && (
          <EditSplit
            projectWalletService={projectWalletService}
            lastHash={lastHash}
            splitAccounts={proposedSplitAccounts}
            split={proposedSplit}
            mainnetProvider={mainnetProvider}
          />
        )}
      </div>
    </div>
  );
};

export default SplitContainer;
