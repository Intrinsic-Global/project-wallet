import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "antd";
import { Address } from "../..";
import { useContractExistsAtAddress, useCustomContractLoader, useCustomContractReader } from "../../../hooks";
import { DepositsWithdrawals } from "./DepositsWithdrawals";
import { SplitContainer } from "./Split/SplitContainer";
import { EventsPanev2 } from "./EventsPane";
import { Signers } from "./Signers";
import { AgreementContent } from "./AgreementContent";
import { ProjectWalletService } from "../../../utils";

export default function ProjectWalletCard({ mainnetProvider, localProvider, userProvider, tx, readContracts }) {
  const [selectedTab, setSelectedTab] = useState("signers");
  const { projectWalletAddress } = useParams();
  // const contractExists = useContractExistsAtAddress(localProvider, projectWalletAddress);
  const projectWalletContractReadOnly = useCustomContractLoader(
    localProvider,
    "DistributingTreaty",
    projectWalletAddress,
  );
  const projectWalletContract = useCustomContractLoader(userProvider, "DistributingTreaty", projectWalletAddress);
  const name = useCustomContractReader(projectWalletContract, "name");
  const projectWalletService = new ProjectWalletService(projectWalletContract, tx);

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
      key: "depositWithdrawals",
      tab: "Deposits and Withdrawals",
    },
  ];

  const boxStyle = {
    padding: 16,
    width: 400,
    margin: "auto",
    marginTop: 32,
    overflow: "hidden",
  };

  const tabContentList = {
    signers: <Button />,
    content: <Button />,
    split: <Button />,
    depositWithdrawalsTab: <Button />,
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
        maxHeight="300px"
        extra={<a href="#">More</a>}
        tabList={tabList}
        activeTabKey={selectedTab}
        onTabChange={key => {
          return onTabChange(key, "key");
        }}
      >
        <div id="tab-set" max-height="300px">
          {selectedTab == "split" && (
            <div id="tab-splits">
              <SplitContainer contract={projectWalletContract} projectWalletService={projectWalletService} />
            </div>
          )}
          {selectedTab == "content" && (
            <div id="tab-agreement-content">
              <AgreementContent contract={projectWalletContract} projectWalletService={projectWalletService} />
            </div>
          )}
          {selectedTab == "signers" && (
            <div id="tab-signers">
              <Signers
                contract={projectWalletContract}
                projectWalletService={projectWalletService}
                mainnetProvider={mainnetProvider}
              />
            </div>
          )}
          {selectedTab == "depositWithdrawals" && (
            <div id="tab-deposits-withdrawals">
              <DepositsWithdrawals
                contract={projectWalletContract}
                localProvider={localProvider}
                projectWalletService={projectWalletService}
              />
            </div>
          )}
        </div>
      </Card>
      <Card title="Events" extra={<a href="#">More</a>}>
        <EventsPanev2
          contract={projectWalletContract}
          readContracts={readContracts}
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
        />
      </Card>
    </div>
  );
}
