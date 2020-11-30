import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, InputNumber } from "antd";
import { SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance } from "../components";
import { useContractReader, useEventListener, useResolveName, useBalance, usePoller } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { validate } from "graphql";

export default function DistributeUI({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
  const [sendValue, setSendValue] = useState("0.01");
  const lastHash = useContractReader(readContracts, "DistributingTreaty","getLastUnsignedHash");
  const splitAccountsFromContract = useContractReader(readContracts, "DistributingTreaty","getSplitAccounts");
  const splitsFromContract = useContractReader(readContracts, "DistributingTreaty","getSplits");
  const splitAccountsFiltered = splitAccountsFromContract && splitAccountsFromContract.filter((x) => x.toString() != "0x0000000000000000000000000000000000000000");
  const splitsFiltered = splitsFromContract && splitsFromContract.slice(0, splitAccountsFiltered && splitAccountsFiltered.length);
  const preparedSplitObjects = prepareSplitObjects(splitAccountsFiltered, splitsFiltered);
  const allocatedEth = useContractReader(readContracts, "DistributingTreaty","checkBalance")
  const projectWalletAddress = readContracts && readContracts.DistributingTreaty.address;
  const projectWalletBalance = useBalance(localProvider, projectWalletAddress);

  console.log('splitAccountsFromContract :>> ', splitAccountsFromContract);
  console.log('splitsFromContract :>> ', splitsFromContract);
  console.log('splitAccountsFromContract filtered :>> ', splitAccountsFiltered);
  console.log('splitsFiltered :>> ', splitsFiltered);
  console.log('preparedSplitObjects :>> ', preparedSplitObjects);

  //📟 Listen for broadcast events
  const allocatedEvents = useEventListener(readContracts, "DistributingTreaty", "Allocated", localProvider, 1);
  const signedByAllEvents = useEventListener(readContracts, "DistributingTreaty", "SignedByAll", localProvider, 1);
  const setSplitEvents = useEventListener(readContracts, "DistributingTreaty", "SetSplit", localProvider, 1);
  const withdrawEvents = useEventListener(readContracts, "DistributingTreaty", "Withdraw", localProvider, 1);
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
        <h4>Balance: {projectWalletBalance && formatEther(projectWalletBalance)}</h4>
        <h4>Available to withdraw: {allocatedEth && formatEther(allocatedEth)}</h4>
        <Divider/>
        <Button onClick={() => {
          tx( writeContracts.DistributingTreaty.registerAsSigner())
        }}>Register as Signer</Button>
        <Button onClick={() => {
          tx( writeContracts.DistributingTreaty.makeActive())
        }}>Make Active</Button>

        <Divider/>
        <h4>Last hash: {lastHash}</h4>
        <Divider/>
   
        <EditSplitsForm tx={tx} writeContracts={writeContracts} lastHash={lastHash} splitAccounts={splitAccountsFiltered} splits={splitsFiltered}/>
          
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
                  Withdraw &nbsp;{formatEther(item._amount)}
                  &nbsp;ETH at block&nbsp;
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

const splitPercentParser = (value) => {
  return value.replace('%', '') * 100
}

const splitPercentFormatter = (value) => {
  return `${value / 100}%`
}

const signSplitHandler = (splitObjects, lastHash, tx, writeContracts) => {
  var splitAccountsArray = []
  var splitsArray = []
  splitObjects.forEach(
    x => {
      splitAccountsArray.push(x.account);
      splitsArray.push(x.split);
    }
  )
  console.log('splitAccountsArray :>> ', splitAccountsArray);
  console.log('splitsArray :>> ', splitsArray);
  tx( writeContracts.DistributingTreaty.signHashWithSplit(lastHash, splitAccountsArray, splitsArray))
}

const validateSplitObjects = (splitObjects) => {
  var sum = 0;
  splitObjects.forEach(x => {
      sum += x.split;
  })
  if(sum == 10000) {
    return true;
  } else {
    return false;
  }
}

const prepareSplitObjects = (splitAccounts, splits) => {
  if(splitAccounts == undefined) {
    return []
  }
  return splitAccounts.map((x, i) => {
    return {
      account: x,
      split: splits && Number(splits[i])
    }
  })
}

const EditSplitsForm = ({tx, writeContracts, lastHash, splitAccounts, splits}) => {
  const [splitObjects, setSplitObjects] = useState([]);
  const preparedSplitObjects = prepareSplitObjects(splitAccounts, splits);
  console.log('splitAccounts :>> ', splitAccounts);
  console.log('splits :>> ', splits);
  console.log("Render EditSplitsForm with splitObjects", splitObjects);
  const EditSplitsForm = (  
      <div className="editSplits">
      <Button onClick={() => {
                    console.log('prepareSplitObjects :>> ', prepareSplitObjects);
                    setSplitObjects(preparedSplitObjects)
                  }}>Make Split Agreement</Button>

            {splitObjects.map((x, idx) => (
              <div key={`split${idx + 1}`} className="splitAccount" style={{"flexDirection": "row", "display": "flex"}}>
                <Input 
                  key={`splitAddressInput${idx + 1}`}
                  placeholder={`Split account #${idx + 1}`}
                  value={splitObjects.length > idx && splitObjects[idx].account}
                  onChange={(e)=>{setSplitObjects( splitObjects.map( (x, jdx) => {
                    if(idx == jdx) {
                      return {...x, account: e.target.value}
                    } else {
                      return x;
                    }
                  }
                  )  )}}
                  />
                <InputNumber 
                  key={`splitInput${idx + 1}`}
                  placeholder={`Split account #${idx +1} split`}
                  value={splitObjects.length > idx && splitObjects[idx].split}
                  defaultValue={0}
                  min={0}
                  max={10000}
                  precision={2}
                  step={100}
                  formatter={splitPercentFormatter}
                  parser={splitPercentParser}
                  onChange={(value)=>{setSplitObjects( splitObjects.map( (x, jdx) => {
                    if(idx == jdx) {
                      return {...x, split: value}
                    } else {
                      return x;
                    }
                  }
                  )  )}}
                  />
                  <Button style={{background: "#d2515185", color: "white"}} onClick={() => {
                    setSplitObjects(splitObjects.filter((x, kdx) => kdx != idx))
                  }}><CloseOutlined /></Button>
              </div>
              )
              )
            }
            <Button onClick={() => {
                setSplitObjects(splitObjects.concat({account: "", split: ""}))
              }}>+</Button>
            <Button onClick={() => {
                console.log(splitObjects);
                if(validateSplitObjects(splitObjects)) {
                  alert("Valid. \n" + JSON.stringify(splitObjects));
                } else {
                  alert("Splits must total 100%. \n" + JSON.stringify(splitObjects));
                }
              }}>Validate</Button>
              <Button onClick={() => signSplitHandler(splitObjects, lastHash, tx, writeContracts)} >Sign Split</Button>
            </div>
  )
  return EditSplitsForm;
}