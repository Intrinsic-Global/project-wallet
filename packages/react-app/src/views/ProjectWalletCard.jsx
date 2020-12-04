import React, { useState } from "react";
import { Button, List, Divider, Input, Card, Table, Tag } from "antd";
import { Address } from "../components";
import { EditSplit, ViewSplit } from "../components";
import { useContractReader, useEventListener, useBalance } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { ethers} from "ethers";
import { humanReadableTreatyStatus, humanReadableSignatureStatus } from "../mappings/enumMappings";

const filterEmpty = (xs) => {
  if (xs == undefined) return [];
  if (xs.filter == undefined) {
    return [];
  }
  return xs.filter((x) => x.toString() != "0x0000000000000000000000000000000000000000" && x.toString() != "0x0000000000000000000000000000000000000000000000000000000000000000" && x.toString() != "");
}

export default function ProjectWalletCard({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
  const [sendValue, setSendValue] = useState("0.01");
  const [withdrawValue, setWithdrawValue] = useState("0");
  const [addText, setAddText] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [selectedTab, setSelectedTab] = useState("signers");
  const name = useContractReader(readContracts, "DistributingTreaty","name");
  const projectWalletAddress = readContracts && readContracts.DistributingTreaty.address;
  const projectWalletBalance = useBalance(localProvider, projectWalletAddress);
  const lastHash = useContractReader(readContracts, "DistributingTreaty","getLastUnsignedHash");
  const activeSplitAccounts = useContractReader(readContracts, "DistributingTreaty","getSplitAccounts");
  const activeSplit = useContractReader(readContracts, "DistributingTreaty","getSplit");
  const proposedSplitAccounts = useContractReader(readContracts, "DistributingTreaty", "getProposedSplitAccounts");
  const proposedSplit = useContractReader(readContracts, "DistributingTreaty", "getProposedSplit");
  const allocatedEth = useContractReader(readContracts, "DistributingTreaty","checkBalance")
  const treatyState = humanReadableTreatyStatus(useContractReader(readContracts, "DistributingTreaty","treatyState"));
  const signers = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getSignatureList"));
  const unsignedHashList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getUnsignedHashList"));
  const signedHashList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getSignedHashList"));
  const unsignedTextList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getUnsignedTextList"));
  const signedTextList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getSignedTextList"));

  //📟 Listen for broadcast events
  const allocatedEvents = useEventListener(readContracts, "DistributingTreaty", "Allocated", localProvider, 1);
  const signedByAllEvents = useEventListener(readContracts, "DistributingTreaty", "SignedByAll", localProvider, 1);
  const setSplitEvents = useEventListener(readContracts, "DistributingTreaty", "SetSplit", localProvider, 1);
  const withdrawEvents = useEventListener(readContracts, "DistributingTreaty", "Withdraw", localProvider, 1);
  const receivedEvents = useEventListener(readContracts, "DistributingTreaty", "Received", localProvider, 1);

  const tabList = [
    {
      key: 'signers',
      tab: 'Signers',
    },
    {
      key: 'content',
      tab: 'Content',
    },
    {
      key: 'activeSplit',
      tab: 'Active Split',
    },
    {
      key: 'proposedSplit',
      tab: 'Proposed Split',
    },
    {
      key: 'depositWithdrawalsTab',
      tab: 'Deposits and Withdrawals',
    },
  ];

  const boxStyle = {
    border:"1px solid #cccccc", 
    padding:16, 
    width:400, 
    margin:"auto",
    marginTop:32,
    overflow:"hidden"
  }
  
  const SignersTab = () => {
    return (
        <div style={boxStyle}>
            <h3>State: {treatyState}</h3>
            <Divider/>
            <Button onClick={() => {
              tx( writeContracts.DistributingTreaty.registerAsSigner())
            }}>Register as Signer</Button>
            <Button onClick={() => {
              tx( writeContracts.DistributingTreaty.makeActive())
            }}>Make Active</Button>

            <Divider/>
            <h3>Signers</h3>
            <div
              style={{"margin": "4px", "display": "flex", "flexDirection": "row", "justifyContent": "center"}}
            >
              {
                signers.map(
                  (x, i) => {
                    return (
                        <Address
                            key={`signer${i}`}
                            value={x}
                            ensProvider={mainnetProvider}
                            fontSize={16}
                        />
                    )
                  }
                )
              }
            </div>
          </div>
      )
  }
  
  const AgreementContentTable = ({contentList}) => {

    const columns = [
      {
        title: 'Entry',
        dataIndex: 'entry',
        key: 'entry',
        render: text => <p>{text}</p>
      },
      {
        title: 'Signed By',
        dataIndex: 'signedBy',
        key: 'signedBy',
        render: signatures => (
          <span>
            {signatures.map( 
              x =>
              (
                <Tag color="geekblue" key={x}>
                  {x}
                </Tag>
              )
            )}
          </span>
        )
      }
    ]
    const data = contentList && contentList.map(
      (x, i) => (
        {
          key: i,
          entry: x,
          signedBy: []
        }
      ));
    return (
      <div>
          <Table columns={columns} dataSource={data} />
      </div>
    )
  }

  const ContentTab = () => {
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
        <div style={{margin:8, display:"flex", "flexDirection":"row"}}>
          <Input value={addText} onChange={(e)=>{
            setAddText(e.target.value);
            setHashInput(ethers.utils.id(addText));
          }}/>
          <Button onClick={()=>{
            tx( writeContracts.DistributingTreaty.writeToTreaty(addText));
          }}>Write Text To Chain</Button>
          <Button onClick={() => tx( writeContracts.DistributingTreaty.signTreaty() )}>Sign</Button>
        </div>

        <div style={{margin:8, display:"flex", "flexDirection":"row"}}>
          <Input value={hashInput} onChange={(e)=>{
            setHashInput(e.target.value)
          }}/>
          <Button onClick={()=>{
            tx( writeContracts.DistributingTreaty.signHash(hashInput));
          }}>Write Hash to Chain and Sign</Button>
        </div>
      </div>
      )
  }
  
  const ActiveSplitTab = () => {
    return (
      <div style={boxStyle}>
        <ViewSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider} />
      </div>
      )
  }

  const ProposedSplitTab = () => {
    return (
      <div style={boxStyle}>
        <EditSplit tx={tx} writeContracts={writeContracts} lastHash={lastHash} splitAccounts={proposedSplitAccounts} split={proposedSplit} mainnetProvider={mainnetProvider} />
      </div>
      )
  }

  const DepositWithdrawalsTab = () => {
    return (
      <div style={boxStyle}>
        <h4>Balance: {projectWalletBalance && formatEther(projectWalletBalance)}</h4>
        <h4>Available to withdraw: {allocatedEth && formatEther(allocatedEth)}</h4>
        <div style={{margin:8, display:"flex", "flexDirection":"row"}}>
          <Input value={sendValue} onChange={(e)=>{
            setSendValue(e.target.value)
          }}/>
          <Button onClick={()=>{
            tx({
              to: writeContracts.DistributingTreaty.address,
              value: parseEther(sendValue)
            });
          }}>💵 Send ETH</Button>
        </div>
        <div style={{margin:8, display:"flex", "flexDirection":"row"}}>
          <Input value={withdrawValue} onChange={(e)=>{
            setWithdrawValue(e.target.value)
          }}/>
          <Button onClick={()=>{
            tx( writeContracts.DistributingTreaty.withdraw(withdrawValue))
          }}>💵 Withdraw ETH</Button>
        </div>
        <Button onClick={() => {
          tx( writeContracts.DistributingTreaty.withdrawMax())
        }}>💵 Withdraw all ({allocatedEth && formatEther(allocatedEth)}) ETH</Button>
      </div>
    )
  }

  const EventsPane = ({receivedEvents}) => {
    return (
     <div>
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <div style={{display: "flex", "flexDirection": "row"}}>
        <List
          bordered
          dataSource={receivedEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item._amount}>
                Received {formatEther(item._amount)}
                &nbsp;ETH
                &nbsp;at block {item.blockNumber}
              </List.Item>
            )
          }}
          />
        <List
          bordered
          dataSource={allocatedEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item._account+"_"+item._amount}>
                Allocated to&nbsp;
                <Address
                    value={item._account}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  />
                {formatEther(item._amount)}
                &nbsp;ETH
                &nbsp;at block {item.blockNumber}
              </List.Item>
            )
          }}
          />
        <List
          bordered
          dataSource={signedByAllEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item._treatyAddress}>
                Signed By All &nbsp;
                <Address
                    value={item._treatyAddress}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  />
                &nbsp;at block&nbsp;
                {item.blockNumber}
              </List.Item>
            )
          }}
          />
          <List
            bordered
            dataSource={setSplitEvents}
            renderItem={(item) => {
              return (
                <List.Item key={item.blockNumber+"_"+item._split}>
                  Agreed on split &nbsp;
                  {item._split.forEach(x => {
                    return x
                  })}
                  &nbsp;at block&nbsp;
                  {item.blockNumber}
                </List.Item>
              )
            }}
            />
          <List
            bordered
            dataSource={withdrawEvents}
            renderItem={(item) => {
              return (
                <List.Item key={item.blockNumber+"_"+item._amount}>
                  Withdraw <Address
                    value={item._to}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> {formatEther(item._amount)}
                   ETH at block &nbsp;
                  {item.blockNumber}
                </List.Item>
              )
            }}
            />
          </div>
      </div>
    </div>
    )
  }
  
  const contentList = {
    signers: <SignersTab/>,
    content: <ContentTab/>,
    activeSplit: <ActiveSplitTab/>,
    proposedSplit: <ProposedSplitTab/>,
    depositWithdrawalsTab: <DepositWithdrawalsTab/>
  };

  const onTabChange = (key, type) => {
    setSelectedTab(key);
  };

  const cardTitle = name;
  const htmlCardTitle = (
    <div>
      <h2>{name}&nbsp;
        <Address
          value={readContracts?readContracts.DistributingTreaty.address:readContracts}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
      </h2>
    </div>
  );

  return (
    <div>
          <Card
            title={htmlCardTitle}
            extra={<a href="#">More</a>}
            tabList={tabList}
            activeTabKey={selectedTab}
            onTabChange={key => {
              return onTabChange(key, 'key');
            }}
            >
              {contentList[selectedTab]}
          </Card>
          <Card
            title="Events"
            extra={<a href="#">More</a>}
            >
            <EventsPane receivedEvents={receivedEvents} />
          </Card>
    </div>
  );
}

