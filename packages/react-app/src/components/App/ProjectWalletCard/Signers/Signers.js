import React from "react";
import { Button, Divider } from "antd";
import { Address } from "../../..";
import { useCustomContractReader } from "../../../../hooks";
import { humanReadableTreatyStatus } from "../../../../mappings/enumMappings";

const Signers = ({ contract, mainnetProvider, projectWalletService }) => {
  console.log("[Signers] contract :>> ", contract);
  const treatyState = humanReadableTreatyStatus(useCustomContractReader(contract, "treatyState"));
  console.log("[Signers] treatyState :>> ", treatyState);
  const signatureList = useCustomContractReader(contract, "getSignatureList");
  return (
    <div>
      <h3>Collaborators</h3>
      <div style={{ margin: "4px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
        {signatureList &&
          signatureList.map((x, i) => (
            <Address key={`signer${i}`} value={x} ensProvider={mainnetProvider} fontSize={16} />
          ))}
        {/* {(signatureList === undefined || signatureList.length == 0) && <div>None</div>} */}
      </div>
      <Divider />
      <h3>State: {treatyState}</h3>
      <Divider />
      <Button
        onClick={() => {
          projectWalletService.registerAsSigner();
        }}
      >
        Register as Signer
      </Button>
      <Button
        onClick={() => {
          projectWalletService.makeActive();
        }}
      >
        Make Active
      </Button>
    </div>
  );
};

export default Signers;
