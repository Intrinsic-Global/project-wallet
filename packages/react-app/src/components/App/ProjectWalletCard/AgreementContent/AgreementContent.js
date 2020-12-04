import React, { useState } from "react";
import { Button, Input, Table, Tag } from "antd";
import { useContractReader } from "../../../../hooks";
import { ethers } from "ethers";
import { filterEmpty } from "../../../../utilities/listUtils";

const AgreementContentTable = ({ contentList }) => {
  const columns = [
    {
      title: "Entry",
      dataIndex: "entry",
      key: "entry",
      render: text => <p>{text}</p>,
    },
    {
      title: "Signed By",
      dataIndex: "signedBy",
      key: "signedBy",
      render: signatures => (
        <span>
          {signatures.map(x => (
            <Tag color="geekblue" key={x}>
              {x}
            </Tag>
          ))}
        </span>
      ),
    },
  ];
  const data =
    contentList &&
    contentList.map((x, i) => ({
      key: i,
      entry: x,
      signedBy: [],
    }));
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

const AgreementContent = ({ readContracts, writeContracts, tx }) => {
  const [addText, setAddText] = useState("");
  const [hashInput, setHashInput] = useState("");
  const unsignedHashList = filterEmpty(useContractReader(readContracts, "DistributingTreaty", "getUnsignedHashList"));
  const signedHashList = filterEmpty(useContractReader(readContracts, "DistributingTreaty", "getSignedHashList"));
  const unsignedTextList = filterEmpty(useContractReader(readContracts, "DistributingTreaty", "getUnsignedTextList"));
  const signedTextList = filterEmpty(useContractReader(readContracts, "DistributingTreaty", "getSignedTextList"));

  const unsignedContent = unsignedTextList.concat(unsignedHashList);
  const signedContent = signedTextList.concat(signedHashList);
  return (
    <div>
      <div>
        <h3>Unsigned Content</h3>
        <AgreementContentTable contentList={unsignedContent} />
      </div>
      <div>
        <h3>Signed Content</h3>
        <AgreementContentTable contentList={signedContent} />
      </div>
      <div style={{ margin: 8, display: "flex", flexDirection: "row" }}>
        <Input
          value={addText}
          onChange={e => {
            setAddText(e.target.value);
            setHashInput(ethers.utils.id(addText));
          }}
        />
        <Button
          onClick={() => {
            tx(writeContracts.DistributingTreaty.writeToTreaty(addText));
          }}
        >
          Write Text To Chain
        </Button>
        <Button onClick={() => tx(writeContracts.DistributingTreaty.signTreaty())}>Sign</Button>
      </div>

      <div style={{ margin: 8, display: "flex", flexDirection: "row" }}>
        <Input
          value={hashInput}
          onChange={e => {
            setHashInput(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            tx(writeContracts.DistributingTreaty.signHash(hashInput));
          }}
        >
          Write Hash to Chain and Sign
        </Button>
      </div>
    </div>
  );
};

export default AgreementContent;
