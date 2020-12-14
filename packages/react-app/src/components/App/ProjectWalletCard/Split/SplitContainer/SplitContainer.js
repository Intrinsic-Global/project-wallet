import React, { useRef } from "react";
import { useCustomContractReader } from "../../../../../hooks";
import { EditSplit } from "../EditSplit";
import { ViewSplit } from "../ViewSplit";
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

mobiscroll.settings = {
  theme: "mobiscroll",
  themeVariant: "light",
};

const popupBtn = [
  {
    text: "Submit",
    handler: "set",
  },
  "cancel",
];

const SplitContainer = ({ contract, projectWalletService, mainnetProvider }) => {
  const activeSplitAccounts = useCustomContractReader(contract, "getSplitAccounts");
  const activeSplit = useCustomContractReader(contract, "getSplit");
  const proposedSplitAccounts = useCustomContractReader(contract, "getProposedSplitAccounts");
  const proposedSplit = useCustomContractReader(contract, "getProposedSplit");
  const lastHash = useCustomContractReader(contract, "getLastUnsignedHash");
  // console.log("proposedSplit :>> ", proposedSplit);
  // console.log("proposedSplitAccounts :>> ", proposedSplitAccounts);
  // console.log("activeSplit :>> ", activeSplit);
  // console.log("activeSplitAccounts :>> ", activeSplitAccounts);

  const popup = useRef();

  const setPopup = comp => {
    this.popup = comp;
  };

  const showPopup = () => {
    // console.log("popup :>> ", popup);
    // popup && popup.current.instance && popup.current.instance.show();
    popup.current.instance.show();
  };

  return (
    <div>
      <mobiscroll.Button onClick={showPopup}>Propose split or agree to proposed split</mobiscroll.Button>
      <mobiscroll.Form>
        <mobiscroll.FormGroup>
          <mobiscroll.FormGroupTitle>Active Distribution</mobiscroll.FormGroupTitle>
          {activeSplit !== undefined && activeSplitAccounts !== undefined && (
            <ViewSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider} />
          )}
        </mobiscroll.FormGroup>
      </mobiscroll.Form>

      {/* <mobiscroll.Button onClick={() => showPopup()}>Show popover with form annon</mobiscroll.Button> */}

      <mobiscroll.Popup ref={popup} display="center" cssClass="mbsc-no-padding" buttons={popupBtn}>
        <mobiscroll.Form>
          <mobiscroll.FormGroup inset>
            <mobiscroll.FormGroupTitle>Proposed Distribution</mobiscroll.FormGroupTitle>
            <mobiscroll.FormGroupContent>
              {proposedSplit !== undefined && proposedSplitAccounts !== undefined && (
                <EditSplit
                  projectWalletService={projectWalletService}
                  lastHash={lastHash}
                  splitAccounts={proposedSplitAccounts}
                  split={proposedSplit}
                  mainnetProvider={mainnetProvider}
                />
              )}
            </mobiscroll.FormGroupContent>
          </mobiscroll.FormGroup>
        </mobiscroll.Form>
      </mobiscroll.Popup>
    </div>
  );
};

export default SplitContainer;

// <div style={{ display: "flex", flexWrap: "wrap" }}>
//   <div id="activesplitcontainer" style={{ flex: "1 0 200px", margin: "0 10px" }}>
//     <h3>Active Distribution</h3>
//     {activeSplit !== undefined && activeSplitAccounts !== undefined && (
//       <ViewSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider} />
//     )}
//   </div>
//   <div id="proposedsplitcontainer" style={{ flex: "1 0 200px", margin: "0 10px" }}>
//     <h3>Proposed Distribution</h3>
//     {proposedSplit !== undefined && proposedSplitAccounts !== undefined && (
//       <EditSplit
//         projectWalletService={projectWalletService}
//         lastHash={lastHash}
//         splitAccounts={proposedSplitAccounts}
//         split={proposedSplit}
//         mainnetProvider={mainnetProvider}
//       />
//     )}
//   </div>
// </div>
