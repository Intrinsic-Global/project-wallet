import React, { useState, useContext } from "react";
import { Button, Input, Form } from "antd";
import { useBalance, useContractReader } from "../../../../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import styled from "styled-components";
import { ProjectWalletService } from "../../../../utils";

const SubmitButton = styled(Button)`
  margin-bottom: 2px;
  margin-top: 2px;
  border-radius: 0px 2px 2px 0px;
  box-sizing: content-box;
  background: #8b798c;
  font-weight: 300;
  text-transform: uppercase;
  color: white;
  padding: 0.35em 0.75em;
  border: none;
  font-size: 1.1em;
  text-decoration: none;
  cursor: pointer;
`;

const DepositButton = styled(SubmitButton)``;

const WithdrawButton = styled(SubmitButton)``;

const SectionedForm = styled(Form)`
  line-height: 1.4;
`;

const SectionedFormGroup = styled(Form)`
  margin-bottom: 1em;
  padding: 10px;
  h3 {
    margin-bottom: 1em;
  }
`;

const SectionedFormList = styled.ul`
  list-style: none;
  margin: 0 0 2em;
  padding: 0;
  margin-bottom: 0.5em;
`;

const SectionedFormLabelItem = styled.li`
  margin-bottom: 0.5em;
`;

const SectionedFormItem = styled.li`
  box-sizing: border-box;
  padding: 0.6em 0.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9em;
  text-decoration: none;
  line-height: normal;
  max-height: 3em;
  .label {
    flex: 1 0 90px;
    max-width: 200px;
  }
  .input,
  .div {
    flex: 1 0 230px;
  }
`;

const DepositsWithdrawals = ({ readContracts, localProvider, projectWalletService }) => {
  const [sendValue, setSendValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const projectWalletAddress = readContracts && readContracts.DistributingTreaty.address;
  const projectWalletBalance = useBalance(localProvider, projectWalletAddress);
  const allocatedEth = useContractReader(readContracts, "DistributingTreaty", "checkBalance");
  return (
    <SectionedForm>
      <SectionedFormGroup>
        <h3>Current Balance</h3>
        <SectionedFormList>
          <SectionedFormItem>
            <label for="total-balance">Project Wallet Balance </label>
            <Input
              name="total-balance"
              value={projectWalletBalance && `${formatEther(projectWalletBalance)} ETH`}
            ></Input>
          </SectionedFormItem>
          <SectionedFormItem>
            <label for="your-balance">Your Allocation </label>
            <Input name="your-balance" value={allocatedEth && `${formatEther(allocatedEth)} ETH`}></Input>
          </SectionedFormItem>
        </SectionedFormList>
      </SectionedFormGroup>
      <SectionedFormGroup>
        <h3>Deposits</h3>
        <SectionedFormList>
          <SectionedFormItem>
            <label for="deposit">Amount to deposit:</label>
            <Input
              name="deposit"
              class="text-input"
              onChange={e => setSendValue(e.target.value)}
              placeholder="Enter amount to deposit"
              value={sendValue}
            />
          </SectionedFormItem>
        </SectionedFormList>
        <DepositButton
          onClick={() => {
            projectWalletService.deposit(sendValue);
          }}
        >
          💵 Deposit ETH
        </DepositButton>
      </SectionedFormGroup>
      <SectionedFormGroup>
        <h3>Withdrawals</h3>
        <SectionedFormList>
          <SectionedFormItem>
            <label for="name">Amount to withdraw:</label>
            <Input
              value={withdrawValue}
              onChange={e => {
                setWithdrawValue(e.target.value);
              }}
            />
          </SectionedFormItem>
        </SectionedFormList>
        <WithdrawButton
          onClick={() => {
            projectWalletService.withdraw(parseEther(withdrawValue));
          }}
        >
          💵 Withdraw ETH
        </WithdrawButton>
        <WithdrawButton
          onClick={() => {
            projectWalletService.withdrawMax();
          }}
        >
          💵 Withdraw all ({allocatedEth && formatEther(allocatedEth)}) ETH
        </WithdrawButton>
      </SectionedFormGroup>
    </SectionedForm>
  );
};

export default DepositsWithdrawals;
