import React, { useState } from "react";
import { Button, InputNumber } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { AddressInput } from "../components";
import { PieChart } from 'react-minimal-pie-chart';
 
export default function EditSplit({tx, writeContracts, lastHash, splitAccounts, split, mainnetProvider }) {

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
    tx( writeContracts.DistributingTreaty.signHashWithSplit(lastHash, splitAccountsArray, splitsArray))
  }
  
  const validateSplitObjects = (splitObjects) => {
    var sum = 0;
    splitObjects.forEach(x => {
        sum += x.split;
    })
    if(sum === 10000) {
      return true;
    } else {
      return false;
    }
  }
  
  const prepareSplitObjects = (splitAccounts, split) => {
    if(splitAccounts === undefined) {
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
    const result = splitObjects.map((x, i) => {
      return { title: x.account,  value: x.split, color: indexToColor(i)}
    })
    return result;
  }

  const [splitObjects, setSplitObjects] = useState(prepareSplitObjects(splitAccounts, split));

  return (  
      <div className="editSplits">
            {splitObjects.map((x, idx) => (
              <div key={`split${idx + 1}`} className="splitAccount" style={{"flexDirection": "row", "display": "flex"}}>
                <AddressInput
                      key={`splitAddressInput${idx}`}
                      id={`splitAddressInput${idx}`}
                      name={`splitAddressInput${idx}`}
                      ensProvider={mainnetProvider}
                      fontSize={16}
                      placeholder={`Split account #${idx + 1}`}
                      value={splitObjects.length > idx && splitObjects[idx].account}
                      onChange={(e)=>{setSplitObjects( splitObjects.map( (x, jdx) => {
                        return (idx === jdx) ? {...x, account: e} : x
                      }
                      )  )}}
                    />
                <InputNumber 
                  key={`splitInput${idx}`}
                  id={`splitInput${idx}`}
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
                    return (idx === jdx) ? {...x, split: value} : x
                  }
                  )  )}}
                  />
                  <Button style={{background: "#d2515185", color: "white"}} onClick={() => {
                    setSplitObjects(splitObjects.filter((x, kdx) => kdx !== idx))
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
  );
}
