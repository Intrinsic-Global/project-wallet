import React from "react";
import { Address } from "../components";
import { PieChart } from 'react-minimal-pie-chart';
 
export default function ViewSplit({lastHash, splitAccounts, split, mainnetProvider}) {

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

  const splitObjects = prepareSplitObjects(splitAccounts, split);

  const ViewSplit = (  
      <div className="viewSplit">
            {splitObjects.map((x, idx) => (
              <div key={`split${idx + 1}`} className="splitAccount" style={{"flexDirection": "row", "display": "flex"}}>
                <Address
                      id={`splitAddress${idx}`}
                      name={`splitAddress${idx}`}
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
  return ViewSplit;
}
