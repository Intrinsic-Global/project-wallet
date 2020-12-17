import React, { useState, useContext } from "react";
import { Button, Input, Form } from "antd";
import { useBalance, useCustomContractReader } from "../../../../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import styled from "styled-components";
import { ProjectWalletService } from "../../../../utils";
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

const DepositsWithdrawals = ({ contract, localProvider, projectWalletService }) => {
  const [sendValue, setSendValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const projectWalletBalance = useBalance(localProvider, contract.address);
  const allocatedEth = useCustomContractReader(contract, "checkBalance");
  return (
    <mobiscroll.Form theme="mobiscroll" themeVariant="light">
      <mobiscroll.FormGroup>
        <mobiscroll.FormGroupTitle>Current Balance</mobiscroll.FormGroupTitle>
        <mobiscroll.Input
          placeholder="First Name"
          name="total-balance"
          value={projectWalletBalance && `${formatEther(projectWalletBalance)} ETH`}
        >
          Project Wallet Balance
        </mobiscroll.Input>
        <mobiscroll.Input
          placeholder="Last Name"
          name="your-balance"
          value={allocatedEth && `${formatEther(allocatedEth)} ETH`}
        >
          Your Allocation
        </mobiscroll.Input>
      </mobiscroll.FormGroup>
      <mobiscroll.FormGroup>
        <mobiscroll.FormGroupTitle>Deposits</mobiscroll.FormGroupTitle>
        <mobiscroll.Input
          name="deposit"
          class="text-input"
          onChange={e => setSendValue(e.target.value)}
          placeholder="Enter amount to deposit"
          value={sendValue}
        >
          Amount to deposit:
        </mobiscroll.Input>
        <mobiscroll.Button
          onClick={() => {
            projectWalletService.deposit(sendValue);
          }}
        >
          💵 Deposit ETH
        </mobiscroll.Button>
      </mobiscroll.FormGroup>
      <mobiscroll.FormGroup>
        <mobiscroll.FormGroupTitle>Withdrawals</mobiscroll.FormGroupTitle>
        <mobiscroll.Input
          value={withdrawValue}
          placeholder="Enter amount to withdraw"
          onChange={e => {
            setWithdrawValue(e.target.value);
          }}
        >
          Amount to withdraw:
        </mobiscroll.Input>
        <mobiscroll.Button
          onClick={() => {
            projectWalletService.withdraw(parseEther(withdrawValue));
          }}
        >
          💵 Withdraw ETH
        </mobiscroll.Button>
        <mobiscroll.Button
          onClick={() => {
            projectWalletService.withdrawMax();
          }}
        >
          💵 Withdraw all ({allocatedEth && formatEther(allocatedEth)}) ETH
        </mobiscroll.Button>
      </mobiscroll.FormGroup>
    </mobiscroll.Form>

    //     <SectionedFormList>
    //       <SectionedFormItem>
    //         <label for="deposit">Amount to deposit:</label>
    //         <Input
    //           name="deposit"
    //           class="text-input"
    //           onChange={e => setSendValue(e.target.value)}
    //           placeholder="Enter amount to deposit"
    //           value={sendValue}
    //         />
    //       </SectionedFormItem>
    //     </SectionedFormList>
    //     <DepositButton
    //       onClick={() => {
    //         projectWalletService.deposit(sendValue);
    //       }}
    //     >
    //       💵 Deposit ETH
    //     </DepositButton>
    //   </SectionedFormGroup>
    //   <SectionedFormGroup>
    //     <h3>Withdrawals</h3>
    //     <SectionedFormList>
    //       <SectionedFormItem>
    //         <label for="name">Amount to withdraw:</label>
    //         <Input
    //           value={withdrawValue}
    //           onChange={e => {
    //             setWithdrawValue(e.target.value);
    //           }}
    //         />
    //       </SectionedFormItem>
    //     </SectionedFormList>
    //     <WithdrawButton
    //       onClick={() => {
    //         projectWalletService.withdraw(parseEther(withdrawValue));
    //       }}
    //     >
    //       💵 Withdraw ETH
    //     </WithdrawButton>
    //     <WithdrawButton
    //       onClick={() => {
    //         projectWalletService.withdrawMax();
    //       }}
    //     >
    //       💵 Withdraw all ({allocatedEth && formatEther(allocatedEth)}) ETH
    //     </WithdrawButton>
    //   </SectionedFormGroup>
    // </SectionedForm>
  );
};

export default DepositsWithdrawals;
