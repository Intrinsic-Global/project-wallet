import React from "react";
import { Button, Divider } from "antd";
import { Address } from "../../..";
import { useContractReader } from "../../../../hooks";
import { humanReadableTreatyStatus } from "../../../../mappings/enumMappings";
import { filterEmpty } from "../../../../utilities/listUtils";

const Signers = ({ readContracts, writeContracts, tx, mainnetProvider }) => {
  const treatyState = humanReadableTreatyStatus(useContractReader(readContracts, "DistributingTreaty", "treatyState"));
  const signatureList = filterEmpty(useContractReader(readContracts, "DistributingTreaty", "getSignatureList"));

  return (
    <div>
      <h3>State: {treatyState}</h3>
      <Divider />
      <Button
        onClick={() => {
          tx(writeContracts.DistributingTreaty.registerAsSigner());
        }}
      >
        Register as Signer
      </Button>
      <Button
        onClick={() => {
          tx(writeContracts.DistributingTreaty.makeActive());
        }}
      >
        Make Active
      </Button>

      <Divider />
      <h3>Signers</h3>
      <div style={{ margin: "4px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
        {signatureList &&
          signatureList.map((x, i) => (
            <Address key={`signer${i}`} value={x} ensProvider={mainnetProvider} fontSize={16} />
          ))}
      </div>
    </div>
  );
};

export default Signers;
