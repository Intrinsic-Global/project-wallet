import React from "react";
import { Button, Divider } from "antd";
import { Address } from "../../..";
import { useCustomContractReader } from "../../../../hooks";
import { humanReadableTreatyStatus } from "../../../../mappings/enumMappings";
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

const DEBUG = false;

const Signers = ({ contract, mainnetProvider, projectWalletService }) => {
  if (DEBUG) console.log("[Signers] contract :>> ", contract);
  const treatyState = humanReadableTreatyStatus(useCustomContractReader(contract, "treatyState"));
  if (DEBUG) console.log("[Signers] treatyState :>> ", treatyState);
  const signatureList = useCustomContractReader(contract, "getSignatureList");
  return (
    <mobiscroll.Form>
      <mobiscroll.FormGroup>
        <mobiscroll.FormGroupTitle>State</mobiscroll.FormGroupTitle>
        <mobiscroll.Input value={treatyState}>State</mobiscroll.Input>
        <mobiscroll.Button onClick={() => projectWalletService.registerAsSigner()}>
          Register as Signer
        </mobiscroll.Button>
        <mobiscroll.Button onClick={() => projectWalletService.makeActive()}>Make Active</mobiscroll.Button>
      </mobiscroll.FormGroup>
      <mobiscroll.FormGroup>
        <mobiscroll.FormGroupTitle>Collaborators</mobiscroll.FormGroupTitle>

        {signatureList &&
          signatureList.map((x, i) => (
            <mobiscroll.FormGroupContent>
              <Address key={`signer${i}`} value={x} ensProvider={mainnetProvider} fontSize={16} />
            </mobiscroll.FormGroupContent>
          ))}
        {(signatureList === undefined || signatureList.length == 0) && <div>None</div>}
      </mobiscroll.FormGroup>
    </mobiscroll.Form>
  );
};

export default Signers;
