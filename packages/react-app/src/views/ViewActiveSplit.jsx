import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, InputNumber } from "antd";
import { SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance } from "../components";
import { useContractReader, useEventListener, useResolveName, useBalance, usePoller } from "../hooks";
import { PieChart } from 'react-minimal-pie-chart';
 
export default function ViewActiveSplit({lastHash, splitAccounts, split, mainnetProvider}) {

  const splitPercentParser = (value) => {
    return value.replace('%', '') * 100
  }

  const splitPercentFormatter = (value) => {
    return `${value / 100}%`
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

  const ViewActiveSplit = (  
      <div className="viewActiveSplit">
      <Button onClick={() => {
        console.log('prepareSplitObjects :>> ', prepareSplitObjects);
                    setSplitObjects(preparedSplitObjects)
                  }}>View Active Split</Button>

            {splitObjects.map((x, idx) => (
              <div key={`split${idx + 1}`} className="splitAccount" style={{"flexDirection": "row", "display": "flex"}}>
                <Address
                      key={`splitAddress${idx}`}
                      ensProvider={mainnetProvider}
                      fontSize={16}
                      value={x.account}
                    />
                <div>{x.split}</div>
              </div>
              )
              )
            }
              {splitObjects && 
                <PieChart
                  data={formatPieChartData(splitObjects)}
                />
              }
      </div>
  )
  return ViewActiveSplit;
}
