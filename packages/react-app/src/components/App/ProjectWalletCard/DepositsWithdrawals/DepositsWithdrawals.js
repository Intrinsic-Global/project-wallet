import React, { useState } from "react";
import { Button, Input } from "antd";
import { useBalance, useContractReader } from "../../../../hooks";
import { parseEther, formatEther } from "@ethersproject/units";

const DepositsWithdrawals = ({ readContracts, writeContracts, tx, projectWalletAddress, localProvider }) => {
  const [sendValue, setSendValue] = useState("0.01");
  const [withdrawValue, setWithdrawValue] = useState("0");
  const projectWalletBalance = useBalance(localProvider, projectWalletAddress);
  const allocatedEth = useContractReader(readContracts, "DistributingTreaty", "checkBalance");

  return (
    <div>
      <h4>Available to withdraw: {allocatedEth && formatEther(allocatedEth)}</h4>
      <h4>Balance: {projectWalletBalance && formatEther(projectWalletBalance)}</h4>
      <div style={{ margin: 8, display: "flex", flexDirection: "row" }}>
        <Input
          value={sendValue}
          onChange={e => {
            setSendValue(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            tx({
              to: writeContracts.DistributingTreaty.address,
              value: parseEther(sendValue),
            });
          }}
        >
          💵 Send ETH
        </Button>
      </div>
      <div style={{ margin: 8, display: "flex", flexDirection: "row" }}>
        <Input
          value={withdrawValue}
          onChange={e => {
            setWithdrawValue(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            tx(writeContracts.DistributingTreaty.withdraw(withdrawValue));
          }}
        >
          💵 Withdraw ETH
        </Button>
      </div>
      <Button
        onClick={() => {
          tx(writeContracts.DistributingTreaty.withdrawMax());
        }}
      >
        💵 Withdraw all ({allocatedEth && formatEther(allocatedEth)}) ETH
      </Button>
    </div>
  );
};

export default DepositsWithdrawals;
