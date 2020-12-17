import React from "react";
import { Address, AddressInput } from "../../../..";
import { PieChart } from "react-minimal-pie-chart";
import { prepareSplitObjects, formatPieChartData, splitPercentFormatter } from "../shared/SplitFunctions";

export default function ViewSplit({ lastHash, splitAccounts, split, mainnetProvider }) {
  const splitObjects = prepareSplitObjects(splitAccounts, split);

  const ViewSplit = (
    <div className="viewSplit" style={{ display: "flex", flexDirection: "column" }}>
      <div className="viewSplitText" style={{ flex: "1 0 100px" }}>
        {splitObjects.map((x, idx) => (
          <div key={`split${idx + 1}`} className="splitAccount" style={{ flexDirection: "row", display: "flex" }}>
            <Address
              id={`splitAddress${idx}`}
              name={`splitAddress${idx}`}
              ensProvider={mainnetProvider}
              fontSize={16}
              value={x.account}
            />
            <div>{splitPercentFormatter(x.split)}</div>
          </div>
        ))}
      </div>
      <div className="viewSplitChart" style={{ flex: "1 0 200px" }}>
        {splitObjects && <PieChart viewBoxSize={[250, 250]} data={formatPieChartData(splitObjects)} />}
      </div>
    </div>
  );
  return ViewSplit;
}
