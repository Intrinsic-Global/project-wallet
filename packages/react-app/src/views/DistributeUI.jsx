import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, InputNumber } from "antd";
import { SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance } from "../components";
import { EditSplitForm, ViewActiveSplit } from ".";
import { useContractReader, useEventListener, useResolveName, useBalance, usePoller } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { ethers} from "ethers";
import { validate } from "graphql";
import {humanReadableTreatyStatus} from "../mappings/enumMappings";

const filterEmpty = (xs) => {
  if (xs == undefined) return [];
  if (xs.filter == undefined) {
    console.log('xs - filter is undefined :>> ', xs);
    return [];
  }
  return xs.filter((x) => x.toString() != "0x0000000000000000000000000000000000000000" && x.toString() != "0x0000000000000000000000000000000000000000000000000000000000000000" && x.toString() != "");
}

export default function DistributeUI({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
  const [sendValue, setSendValue] = useState("0.01");
  const lastHash = useContractReader(readContracts, "DistributingTreaty","getLastUnsignedHash");
  
  // const splitAccountsFromContract = useContractReader(readContracts, "DistributingTreaty","getSplitAccounts");
  // const splitAccountsFiltered = filterEmpty(splitAccountsFromContract);
  
  // const splitsFromContract = useContractReader(readContracts, "DistributingTreaty","getSplit");
  // const splitsFiltered = splitsFromContract && splitsFromContract.slice(0, splitAccountsFiltered && splitAccountsFiltered.length);
  
  const activeSplitAccounts = useContractReader(readContracts, "DistributingTreaty","getSplitAccounts");
  const activeSplit = useContractReader(readContracts, "DistributingTreaty","getSplit");

  // const getAddresses = useContractReader(readContracts, "Scratch", "getAddresses");
  // const getAddressesDirect = useContractReader(readContracts, "Scratch", "getAddressesDirect");
  // console.log('scratch getAddresses :>> ', getAddresses);
  // console.log('scratch getAddressesDirect :>> ', getAddressesDirect);  
  
  const proposedSplitAccounts = useContractReader(readContracts, "DistributingTreaty", "getProposedSplitAccounts");
  const proposedSplit = useContractReader(readContracts, "DistributingTreaty", "getProposedSplit");

  console.log('getProposedSplitAccounts :>> ', proposedSplitAccounts);
  console.log('getProposedSplit :>> ', proposedSplit);
  const allocatedEth = useContractReader(readContracts, "DistributingTreaty","checkBalance")
  const projectWalletAddress = readContracts && readContracts.DistributingTreaty.address;
  const projectWalletBalance = useBalance(localProvider, projectWalletAddress);
  const name = useContractReader(readContracts, "DistributingTreaty","name");
  const treatyState = humanReadableTreatyStatus(useContractReader(readContracts, "DistributingTreaty","treatyState"));
  const signers = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getSignatureList"));
  const unsignedHashList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getUnsignedHashList"));
  const signedHashList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getSignedHashList"));
  const unsignedTextList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getUnsignedTextList"));
  const signedTextList = filterEmpty(useContractReader(readContracts, "DistributingTreaty","getSignedTextList"));
  const [addText, setAddText] = useState("");
  const [hashInput, setHashInput] = useState("");
  console.log('signers :>> ', signers);
  console.log('unsignedHashList :>> ', unsignedHashList);
  console.log('signedHashList :>> ', signedHashList);
  console.log('unsignedTextList :>> ', unsignedHashList);
  console.log('signedTextList :>> ', signedTextList);
  console.log('proposedSplitAccounts :>> ', proposedSplitAccounts);
  console.log('proposedSplit :>> ', proposedSplit);


  // console.log('splitAccountsFromContract :>> ', splitAccountsFromContract);
  // console.log('splitsFromContract :>> ', splitsFromContract);
  // console.log('splitAccountsFromContract filtered :>> ', splitAccountsFiltered);
  // console.log('splitsFiltered :>> ', splitsFiltered);

  //📟 Listen for broadcast events
  const allocatedEvents = useEventListener(readContracts, "DistributingTreaty", "Allocated", localProvider, 1);
  const signedByAllEvents = useEventListener(readContracts, "DistributingTreaty", "SignedByAll", localProvider, 1);
  const setSplitEvents = useEventListener(readContracts, "DistributingTreaty", "SetSplit", localProvider, 1);
  const withdrawEvents = useEventListener(readContracts, "DistributingTreaty", "Withdraw", localProvider, 1);
  const receivedEvents = useEventListener(readContracts, "DistributingTreaty", "Received", localProvider, 1);
  console.log("📟 allocatedEvents events:",allocatedEvents)
  console.log("📟 signedByAllEvents events:",signedByAllEvents)
  console.log("📟 setSplitEvents events:",setSplitEvents)

  return (
    <div>
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64,overflow:"hidden"}}>
        <h2>Project Wallet <Address
            value={readContracts?readContracts.DistributingTreaty.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        /></h2>
        <h2>{name}</h2>
        <h4>Balance: {projectWalletBalance && formatEther(projectWalletBalance)}</h4>
        <h4>Available to withdraw: {allocatedEth && formatEther(allocatedEth)}</h4>
        <Divider/>
        <h3>Proposed split accounts</h3>
        {proposedSplitAccounts && proposedSplitAccounts.map && proposedSplitAccounts.map( x => (
          <div>{x}</div>
          // <div>JSON.stringify({x}.toString())</div>
        ))}
        <h3>Proposed split</h3>
        {proposedSplit && proposedSplit.map && proposedSplit.map( x => (
          <div>{Number(x)}</div>
          // <div>JSON.stringify({x}.toString())</div>
        ))}
        <Divider/>
        <h3>{treatyState}</h3>
        <Button onClick={() => {
          tx( writeContracts.DistributingTreaty.registerAsSigner())
        }}>Register as Signer</Button>
        <Button onClick={() => {
          tx( writeContracts.DistributingTreaty.makeActive())
        }}>Make Active</Button>

        <Divider/>
        <h3>Signers</h3>
        <div
          style={{"margin": "4px", "display": "flex", "flex-direction": "row", "justify-content": "center"}}
        >
          {
            signers.map(
              x => {
                return (
                    <Address
                        value={x}
                        ensProvider={mainnetProvider}
                        fontSize={16}
                    />
                )
              }
            )
          }
        </div>
        <Divider/>
        <h3>Unsigned Hash List</h3>
        {
          unsignedHashList.map(
            x => {
              return (
                <div style={{color: "DarkGoldenRod"}}>{x}</div>
              )
            }
          )
        }
        <h3>Signed Hash List</h3>
        {
          signedHashList.map(
            x => {
              return (
                <div style={{color: "DarkGreen"}}>{x}</div>
              )
            }
          )
        }
        <Divider/>
        <h3>Unsigned Text</h3>
        {
          unsignedTextList.map(
            x => {
              return (
                <div style={{color: "DarkGoldenRod"}}>{x}</div>
              )
            }
          )
        }
        <h3>Signed Text</h3>
        {
          signedTextList.map(
            x => {
              return (
                <div style={{color: "DarkGreen"}}>{x}</div>
              )
            }
          )
        }
          <Divider />

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

       {/* <Button onClick={() => {
          addText == ""
          ? window.alert("Enter text")
          : setHashInput(ethers.utils.id(addText))
        }}>Get Hash</Button> */}

        <Divider/>
        <h4>Last hash: {lastHash}</h4>
        <Divider/>
        <ViewActiveSplit splitAccounts={activeSplitAccounts} split={activeSplit} mainnetProvider={mainnetProvider}/>
   
        <Divider/>
        {/* <EditSplitForm tx={tx} writeContracts={writeContracts} lastHash={lastHash} splitAccounts={splitAccountsFiltered} splits={splitsFiltered} mainnetProvider={mainnetProvider}/> */}
        <EditSplitForm tx={tx} writeContracts={writeContracts} lastHash={lastHash} splitAccounts={proposedSplitAccounts} split={proposedSplit} mainnetProvider={mainnetProvider}/>
          

        <Divider />

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
        <Button onClick={() => {
          tx( writeContracts.DistributingTreaty.withdrawMax())
        }}>💵 Withdraw {allocatedEth && formatEther(allocatedEth)} ETH</Button>
      </div>
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Events:</h2>
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
              console.log('withdraw item :>> ', item);
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
  );
}