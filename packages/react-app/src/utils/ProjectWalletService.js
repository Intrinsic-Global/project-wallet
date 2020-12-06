import { parseEther, formatEther } from "@ethersproject/units";
import { ethers } from "ethers";

export default class ProjectWalletService {
  constructor(writeContracts, tx) {
    this.tx = tx;
    this.writeContracts = writeContracts;
  }

  withdrawMax() {
    return this.tx(this.writeContracts.DistributingTreaty.withdrawMax());
  }

  withdraw(amount) {
    return this.tx(this.writeContracts.DistributingTreaty.withdraw(amount));
  }

  deposit(amount) {
    return this.tx({
      to: this.writeContracts.DistributingTreaty.address,
      value: parseEther(amount),
    });
  }

  writeAgreementText(text) {
    return this.tx(this.writeContracts.DistributingTreaty.writeToTreaty(text));
  }

  calculateHash(text) {
    return ethers.utils.id(text);
  }

  sign() {
    this.tx(this.writeContracts.DistributingTreaty.signTreaty());
  }

  signHash(hash) {
    this.tx(this.writeContracts.DistributingTreaty.signHash(hash));
  }

  registerAsSigner() {
    this.tx(this.writeContracts.DistributingTreaty.registerAsSigner());
  }

  makeActive() {
    this.tx(this.writeContracts.DistributingTreaty.makeActive());
  }

  signHashWithSplit(lastHash, splitAccounts, split) {
    this.tx(this.writeContracts.DistributingTreaty.signHashWithSplit(lastHash, splitAccounts, split));
  }
}
