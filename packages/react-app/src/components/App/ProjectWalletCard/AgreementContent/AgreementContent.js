import React, { useState } from "react";
import { Button, Input, Table, Tag } from "antd";
import { useCustomContractReader } from "../../../../hooks";

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

const AgreementContent = ({ contract, projectWalletService }) => {
  const [addText, setAddText] = useState("");
  const [hashInput, setHashInput] = useState("");

  const unsignedHashList = useCustomContractReader(contract, "getUnsignedHashList");
  const signedHashList = useCustomContractReader(contract, "getSignedHashList");
  const unsignedTextList = useCustomContractReader(contract, "getUnsignedTextList");
  const signedTextList = useCustomContractReader(contract, "getSignedTextList");

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
            setHashInput(projectWalletService.calculateHash(addText));
          }}
        />
        <Button
          onClick={() => {
            projectWalletService.writeAgreementText(addText);
          }}
        >
          Write Text To Chain
        </Button>
        <Button onClick={() => projectWalletService.sign()}>Sign</Button>
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
            projectWalletService.signHash(hashInput);
          }}
        >
          Write Hash to Chain and Sign
        </Button>
      </div>
    </div>
  );
};

export default AgreementContent;
