import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, InputNumber } from "antd";
import { SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance } from "../components";
import { useContractReader, useEventListener, useResolveName, useBalance, usePoller } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { validate } from "graphql";
import { PieChart } from 'react-minimal-pie-chart';
 
export default function EditSplitForm({tx, writeContracts, lastHash, splitAccounts, split, mainnetProvider }) {

  const handleFocus = (e) => e.target.select();

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
    console.log('splitAccountsArray :>> ', splitAccountsArray, 'splitsArray :>> ', splitsArray);
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
  
  const prepareSplitObjects = (splitAccounts, split) => {
    if(splitAccounts == undefined) {
      return []
    }
    return splitAccounts.map((x, i) => {
      return {
        account: x,
        split: split && Number(split[i])
      }
    })
  }

  const indexToColor = (index) => {
    const colors = {
      0: '#22577a',
      1: '#38a3a5',
      2: '#57cc99',
      3: '#80ed99',
      4: '#38a3a5',
      5: '#c7f9cc'
    }
    return(colors[index % Object.keys(colors).length]);
  }

  const formatPieChartData = (splitObjects) => {
    console.log('pie input :>> ', splitObjects);
    const result = splitObjects.map((x, i) => {
      return { title: x.account,  value: x.split, color: indexToColor(i)}
    })
    
    console.log('pie result :>> ', result);
    return result;
  }

  const [splitObjects, setSplitObjects] = useState([]);
  const preparedSplitObjects = prepareSplitObjects(splitAccounts, split);
  console.log('splitAccounts :>> ', splitAccounts);
  console.log('split :>> ', split);
  console.log("pie Render EditSplitForm with splitObjects", splitObjects);
  console.log("pie", formatPieChartData(splitObjects));

  const EditSplitForm = (  
      <div className="editSplits">
      <Button onClick={() => {
        console.log('prepareSplitObjects :>> ', prepareSplitObjects);
                    setSplitObjects(preparedSplitObjects)
                  }}>Propose / Accept Split</Button>

            {splitObjects.map((x, idx) => (
              <div key={`split${idx + 1}`} className="splitAccount" style={{"flexDirection": "row", "display": "flex"}}>
                <AddressInput
                      key={`splitAddressInput${idx}`}
                      name={`splitAddressInput${idx}`}
                      ensProvider={mainnetProvider}
                      fontSize={16}
                      placeholder={`Split account #${idx + 1}`}
                      value={splitObjects.length > idx && splitObjects[idx].account}
                      onChange={(e)=>{setSplitObjects( splitObjects.map( (x, jdx) => {
                        return (idx == jdx) ? {...x, account: e} : x
                      }
                      )  )}}
                    />
                <InputNumber 
                  key={`splitInput${idx}`}
                  placeholder={`Split account #${idx} split`}
                  value={splitObjects.length > idx && splitObjects[idx].split}
                  defaultValue={0}
                  min={0}
                  max={10000}
                  precision={2}
                  step={100}
                  formatter={splitPercentFormatter}
                  parser={splitPercentParser}
                  onFocus={handleFocus}
                  onChange={(value)=>{setSplitObjects( splitObjects.map( (x, jdx) => {
                    return (idx == jdx) ? {...x, split: value} : x
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
              {splitObjects && 
                <PieChart
                  data={formatPieChartData(splitObjects)}
                />
              }
      </div>
  )
  return EditSplitForm;
}
