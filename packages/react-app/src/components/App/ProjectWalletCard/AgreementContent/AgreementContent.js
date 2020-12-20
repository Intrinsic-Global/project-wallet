import React, { useState } from "react";
import { Button, Input, Table, Tag } from "antd";
import { useCustomContractReader } from "../../../../hooks";
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

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

  const unsignedContent = [].concat(unsignedTextList).concat(unsignedHashList);
  const signedContent = [].concat(signedTextList).concat(signedHashList);
  return (
    <mobiscroll.Form>
      <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
        <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
          <mobiscroll.FormGroup>
            <mobiscroll.FormGroupTitle>Unsigned Content</mobiscroll.FormGroupTitle>
            {/* <mobiscroll.FormGroupContent> */}
            <AgreementContentTable contentList={unsignedContent} />
            {/* </mobiscroll.FormGroupContent> */}
          </mobiscroll.FormGroup>
        </div>
        <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
          <mobiscroll.FormGroup>
            <mobiscroll.FormGroupTitle>Signed Content</mobiscroll.FormGroupTitle>
            {/* <mobiscroll.FormGroupContent> */}
            <AgreementContentTable contentList={signedContent} />
            {/* </mobiscroll.FormGroupContent> */}
          </mobiscroll.FormGroup>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
          <div style={{ flexGrow: "1" }}>
            <mobiscroll.FormGroup>
              <mobiscroll.FormGroupTitle>Plain text interactions</mobiscroll.FormGroupTitle>
              <mobiscroll.Input
                value={addText}
                onChange={e => {
                  setAddText(e.target.value);
                  setHashInput(projectWalletService.calculateHash(addText));
                }}
              />
              <mobiscroll.Button
                onClick={() => {
                  projectWalletService.writeAgreementText(addText);
                }}
              >
                Write Text To Chain
              </mobiscroll.Button>
              <mobiscroll.Button onClick={() => projectWalletService.sign()}>Sign</mobiscroll.Button>
            </mobiscroll.FormGroup>
          </div>
          <div style={{ flexGrow: "1" }}>
            <mobiscroll.FormGroup>
              <mobiscroll.FormGroupTitle>Hash Interactions</mobiscroll.FormGroupTitle>
              <mobiscroll.Input
                value={hashInput}
                onChange={e => {
                  setHashInput(e.target.value);
                }}
              />
              <mobiscroll.Button
                onClick={() => {
                  projectWalletService.signHash(hashInput);
                }}
              >
                Write Hash to Chain and Sign
              </mobiscroll.Button>{" "}
            </mobiscroll.FormGroup>
          </div>
        </div>
      </div>
    </mobiscroll.Form>

    //   </div>
    //   <div style={{ margin: 8, display: "flex", flexDirection: "row" }}>
    //     <mobiscroll.Input
    //       value={hashInput}
    //       onChange={e => {
    //         setHashInput(e.target.value);
    //       }}
    //     />
    //     <mobiscroll.Button
    //       onClick={() => {
    //         projectWalletService.signHash(hashInput);
    //       }}
    //     >
    //       Write Hash to Chain and Sign
    //     </mobiscroll.Button>
    //   </div>
    // </div>
  );
};

export default AgreementContent;
