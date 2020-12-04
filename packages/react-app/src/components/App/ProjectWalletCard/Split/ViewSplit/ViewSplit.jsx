import React from "react";
import { Address, AddressInput } from "../../../..";
import { PieChart } from "react-minimal-pie-chart";
import { prepareSplitObjects, formatPieChartData } from "../shared/SplitFunctions";

export default function ViewSplit({ lastHash, splitAccounts, split, mainnetProvider }) {
  const splitObjects = prepareSplitObjects(splitAccounts, split);

  const ViewSplit = (
    <div className="viewSplit">
      {splitObjects.map((x, idx) => (
        <div key={`split${idx + 1}`} className="splitAccount" style={{ flexDirection: "row", display: "flex" }}>
          <Address
            id={`splitAddress${idx}`}
            name={`splitAddress${idx}`}
            ensProvider={mainnetProvider}
            fontSize={16}
            value={x.account}
          />
          <div>{x.split}</div>
        </div>
      ))}
      {splitObjects && <PieChart data={formatPieChartData(splitObjects)} />}
    </div>
  );
  return ViewSplit;
}
