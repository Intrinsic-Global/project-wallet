import { parseEther, formatEther } from "@ethersproject/units";
import { ethers } from "ethers";

export default class ProjectWalletService {
  constructor(projectWalletContract, tx) {
    this.projectWalletContract = projectWalletContract;
    this.tx = tx;
  }

  withdrawMax() {
    return this.tx(this.projectWalletContract["withdrawMax"]());
  }

  withdraw(amount) {
    return this.tx(this.projectWalletContract["withdraw"](amount));
  }

  deposit(amount) {
    return this.tx({
      to: this.projectWalletContract.address,
      value: parseEther(amount),
    });
  }

  writeAgreementText(text) {
    return this.tx(this.projectWalletContract["writeToTreaty"](text));
  }

  calculateHash(text) {
    return ethers.utils.id(text);
  }

  sign() {
    this.tx(this.projectWalletContract["signTreaty"]());
  }

  signHash(hash) {
    this.tx(this.projectWalletContract["signHash"](hash));
  }

  registerAsSigner() {
    // console.log(
    //   "[ProjectWalletService] Register as Signer:>> ",
    //   this.tx,
    //   this.writeContracts,
    //   this.projectWalletContract,
    // );
    return this.tx(this.projectWalletContract["registerAsSigner"]());
  }

  makeActive() {
    // console.log("[ProjectWalletService] Make active:>> ", this.tx, this.writeContracts);
    return this.tx(this.projectWalletContract["makeActive"]());
  }

  signHashWithSplit(lastHash, splitAccounts, split) {
    return this.tx(this.projectWalletContract["signHashWithSplit"](lastHash, splitAccounts, split));
  }
}
