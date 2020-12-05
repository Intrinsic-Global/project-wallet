import React, { useState } from "react";
import { Card } from "antd";
import { Address } from "../..";
import { useContractReader } from "../../../hooks";
import { DepositsWithdrawals } from "./DepositsWithdrawals";
import { SplitContainer } from "./Split/SplitContainer";
import { EventsPane } from "./EventsPane";
import { Signers } from "./Signers";
import { AgreementContent } from "./AgreementContent";

export default function ProjectWalletCard({ mainnetProvider, localProvider, tx, readContracts, writeContracts }) {
  const [selectedTab, setSelectedTab] = useState("signers");
  const name = useContractReader(readContracts, "DistributingTreaty", "name");
  console.log("mainnetProvider :>> ", mainnetProvider);

  const onTabChange = key => {
    setSelectedTab(key);
  };

  const tabList = [
    {
      key: "signers",
      tab: "Signers",
    },
    {
      key: "content",
      tab: "Agreement Content",
    },
    {
      key: "split",
      tab: "Distribution",
    },
    {
      key: "depositWithdrawalsTab",
      tab: "Deposits and Withdrawals",
    },
  ];

  const boxStyle = {
    // border: "1px solid #cccccc",
    padding: 16,
    width: 400,
    margin: "auto",
    marginTop: 32,
    overflow: "hidden",
  };

  const SignersTab = () => {
    return (
      <div style={boxStyle}>
        <Signers
          readContracts={readContracts}
          writeContracts={writeContracts}
          tx={tx}
          mainnetProvider={mainnetProvider}
        />
      </div>
    );
  };

  const AgreementContentTab = () => {
    return <AgreementContent readContracts={readContracts} writeContracts={writeContracts} tx={tx} />;
  };

  const DepositWithdrawalsTab = () => {
    return (
      <div style={boxStyle}>
        <DepositsWithdrawals
          readContracts={readContracts}
          writeContracts={writeContracts}
          tx={tx}
          localProvider={localProvider}
        />
      </div>
    );
  };

  const DistributionTab = () => {
    return (
      // <div style={boxStyle}>
      <SplitContainer readContracts={readContracts} writeContracts={writeContracts} tx={tx} />
      // </div>
    );
  };

  const tabContentList = {
    signers: <SignersTab />,
    content: <AgreementContentTab />,
    split: <DistributionTab />,
    depositWithdrawalsTab: <DepositWithdrawalsTab />,
  };

  const htmlCardTitle = (
    <div>
      <h2>
        {name}&nbsp;
        <Address
          value={readContracts ? readContracts.DistributingTreaty.address : readContracts}
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
          return onTabChange(key, "key");
        }}
      >
        {tabContentList[selectedTab]}
      </Card>
      <Card title="Events" extra={<a href="#">More</a>}>
        <EventsPane readContracts={readContracts} localProvider={localProvider} mainnetProvider={mainnetProvider} />
      </Card>
    </div>
  );
}
