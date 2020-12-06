import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import { Address } from "../..";
import {
  useContractReader,
  useContractExistsAtAddress,
  useCustomContractLoader,
  useCustomContractReader,
} from "../../../hooks";
import { DepositsWithdrawals } from "./DepositsWithdrawals";
import { SplitContainer } from "./Split/SplitContainer";
import { EventsPane } from "./EventsPane";
import { Signers } from "./Signers";
import { AgreementContent } from "./AgreementContent";
import { useEffect } from "react";

export default function ProjectWalletCard({
  mainnetProvider,
  localProvider,
  userProvider,
  tx,
  readContracts,
  writeContracts,
}) {
  // const [name, setName] = useState();
  const { projectWalletAddress } = useParams();
  console.log("projectWalletAddress :>> ", projectWalletAddress);
  const contractExists = useContractExistsAtAddress(localProvider, projectWalletAddress);
  console.log("[projectwalletcard] contractExists :>> ", contractExists);
  const projectWalletContractReadOnly = useCustomContractLoader(
    localProvider,
    "DistributingTreaty",
    projectWalletAddress,
  );
  const projectWalletContract = useCustomContractLoader(userProvider, "DistributingTreaty", projectWalletAddress);
  console.log("[projectwalletcard] projectWalletContract :>> ", projectWalletContract);
  console.log("[projectwalletcard] projectWalletContractReadOnly :>> ", projectWalletContractReadOnly);

  const name = useCustomContractReader(projectWalletContract, "name");
  const [selectedTab, setSelectedTab] = useState("signers");
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
          contract={projectWalletContract}
          writeContracts={writeContracts}
          tx={tx}
          mainnetProvider={mainnetProvider}
        />
      </div>
    );
  };

  const AgreementContentTab = () => {
    return (
      <AgreementContent
        contract={projectWalletContract}
        writeContracts={writeContracts}
        tx={tx}
        contract={projectWalletContract}
      />
    );
  };

  const DepositWithdrawalsTab = () => {
    return (
      <div style={boxStyle}>
        <DepositsWithdrawals
          contract={projectWalletContract}
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
      <SplitContainer contract={projectWalletContract} writeContracts={writeContracts} tx={tx} />
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
