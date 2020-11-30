const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity, createFixtureLoader, loadFixture } = require("ethereum-waffle");

use(solidity);

describe("Distributing Treaty", function () {
  let distributingTreaty;

  let addr0;
  let addr1;
  let addr2;
  let addrs;

  let initialBalance;

  let provider;

  before(async function () {
    [addr0, addr1, addr2, ...addrs] = await ethers.getSigners();
    initialBalance = await addr0._signer.provider.getBalance(addr0.address);
    initialBalance1 = await addr1._signer.provider.getBalance(addr1.address);
    initialBalance2 = await addr2._signer.provider.getBalance(addr2.address);
    // console.log('initialBalance :>> ', initialBalance.toString());
    // console.log('initialBalance1 :>> ', initialBalance1.toString());
    // console.log('initialBalance2 :>> ', initialBalance2.toString());
    provider = addr0._signer.provider;
  })
  
  describe("DistributingTreaty", function () {
    it("Should deploy DistributingTreaty", async function () {
      const DistributingTreaty = await ethers.getContractFactory("DistributingTreaty");
      
      distributingTreaty = await DistributingTreaty.deploy(1, "Micro Print", "Micro Enterprise @ The Naval Store");
    });

    describe("registerAsSigner()", function () {
      it("Should be able to register first signer", async function () {
        await distributingTreaty.registerAsSigner();
        expect(await distributingTreaty.getNumSignatures()).to.equal(1);
      });
      it("Should be able to register second signer", async function () {
        await distributingTreaty.connect(addr1).registerAsSigner();
        expect(await distributingTreaty.getNumSignatures()).to.equal(2);
      });
    });

    describe("makeActive()", function () {
      it("Should be able to make active", async function () {
        expect(await distributingTreaty.treatyState()).to.equal(0);
        await distributingTreaty.makeActive();
        expect(await distributingTreaty.treatyState()).to.equal(1);
      });
    });

    describe("signHash()", async () => {
      it("Should sign with hash", async function () {
        const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Contract being signed..."));
        const txSignA = await distributingTreaty.connect(addr1).signHash(hash);
        // console.log('txSignA :>> ', txSignA);
        // const txSignB = await distributingTreaty.connect(addr2.adddress).signHash(hash);
        // console.log('txSignB :>> ', txSignB);
        // expect(await distributingTreaty.getLastSignedHash()).to.equal(hash);
      })
  });

  // it("different hash resets signatures ", async () => {
  //   let treaty = await Treaty.deployed();
  //   const hash1 = Web3.utils.keccak256("Content X being signed");
  //   const hash2 = Web3.utils.keccak256("Modified content X being signed");
  //   await treaty.signHash(hash1, { from: partyA });
  //   await treaty.signHash(hash1, { from: partyB });
  //   await treaty.signHash(hash2, { from: partyC });
  //   assert.notEqual(await treaty.getLastSignedHash(), hash1);
  // });

  // it("signed once everyone signs same hash", async () => {
  //   let treaty = await Treaty.deployed();
  //   const hash2 = Web3.utils.keccak256("Modified content X being signed");
  //   await treaty.signHash(hash2, { from: partyA });
  //   await treaty.signHash(hash2, { from: partyB });
  //   assert.equal(await treaty.getLastSignedHash(), hash2);
  // });
    const numUnsignedHash = 1;

    describe("signHashWithSplit()", function () {
      it("Should be able to sign hash with split [Signer1]", async function () {
        const hash = "0x115af72b771d3d54e1d1082b56d6f9a475718fdd274c66a46814536facb32901";
        const splitAccounts = [addr1.address, addr2.address];
        const split = [7000, 3000];
        await distributingTreaty.signHashWithSplit(hash, splitAccounts, split);
        expect(await distributingTreaty.unsignedHash(numUnsignedHash)).to.equal(hash, "unsignedHash(0)");
        expect(await distributingTreaty.getLastUnsignedHash()).to.equal(hash, "getLastUnsignedHash");
      });

      it("Should be able to sign hash with split [Signer2]. Hash and split now confirmed", async function () {
        const hash = "0x115af72b771d3d54e1d1082b56d6f9a475718fdd274c66a46814536facb32901";
        const splitAccounts = [addr1.address, addr2.address];
        const split = [7000, 3000];
        await distributingTreaty.connect(addr1).signHashWithSplit(hash, splitAccounts, split);
        expect(await distributingTreaty.signedHash(numUnsignedHash)).to.equal(hash);
      });
    });

    describe("receive()", function () {
      it("Should send ETH to the treaty", async function () {
        const value = ethers.utils.parseEther("33.33");
        const tx = {
          to: distributingTreaty.address,
          value: value
        };
        const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
        const connectedWallet = await wallet.connect(provider);
        const rcpt = await connectedWallet.sendTransaction(tx);
        const walletBalance = await provider.getBalance(wallet.address);
        const contractBalance = await provider.getBalance(distributingTreaty.address);
        const balance0 = await provider.getBalance(addr0.address);
        const balance1 = await provider.getBalance(addr1.address);
        const balance2 = await provider.getBalance(addr2.address);
        // console.log('walletBalance :>> ', ethers.utils.formatUnits(walletBalance.toString()));
        // console.log('contractBalance :>> ', ethers.utils.formatUnits(contractBalance.toString()));
        // console.log('balance0 :>> ', ethers.utils.formatUnits(balance0.toString()));
        // console.log('balance1 :>> ', ethers.utils.formatUnits(balance1.toString()));
        // console.log('balance2 :>> ', ethers.utils.formatUnits(balance2.toString()));
      });
    });
    
    describe("ethAllocations()", function () {
      it("Should show correct ethAllocation", async function () {
        const ethAllocation1 = await distributingTreaty.ethAllocations(addr1.address);
        expect(ethAllocation1.toString()).to.equal(ethers.utils.parseEther("23.331").toString());   
      });
    });

    describe("withdraw()", function () {
      it("Should withdraw 1 ETH of allocated funds", async function () {
        const provider = addr0._signer.provider;
        // console.log("Starting balance addr1 is " + await provider.getBalance(addr1.address));
        // console.log("Starting balance addr2 is " + await provider.getBalance(addr2.address));
        const startingBalance1 = await provider.getBalance(addr1.address);
        const startingBalance2 = await provider.getBalance(addr2.address);

        const tx1 = await distributingTreaty.connect(addr1).withdraw(ethers.utils.parseEther("1.0"));
        const tx2 = await distributingTreaty.connect(addr2).withdraw(ethers.utils.parseEther("1.0"));
        const contractBalance = await provider.getBalance(distributingTreaty.address);
        const actualEndBalance1 = await provider.getBalance(addr1.address);
        const actualEndBalance2 = await provider.getBalance(addr2.address);

        // console.log(tx1);


        const rcpt1 = await provider.waitForTransaction(tx1.hash);
        const rcpt2 = await provider.waitForTransaction(tx2.hash);
        // console.log('rcpt1 :>> ', rcpt1);

        // console.log("tx1 gas used: " + rcpt1.gasUsed.toNumber());
        // console.log("tx2 gas used: " + rcpt2.gasUsed.toNumber());

        // console.log("Ending balance addr1 is " + await provider.getBalance(addr1.address));
        // console.log("Ending balance addr2 is " + await provider.getBalance(addr2.address));


        // console.log('contractBalance :>> ', ethers.utils.formatUnits(contractBalance.toString()));
        // console.log('balance1 :>> ', ethers.utils.formatUnits(actualEndBalance1.toString()));
        // console.log('balance2 :>> ', ethers.utils.formatUnits(actualEndBalance2.toString()));

        expect(contractBalance, "contractBalance").to.equal(ethers.utils.parseEther("31.33"));

        const expectedEndBalance1 = startingBalance1.add(ethers.utils.parseEther("1.0"));
        const expectedEndBalance2 = startingBalance2.add(ethers.utils.parseEther("1.0"));

        const balanceDiff1 = expectedEndBalance1.sub(actualEndBalance1);
        const balanceDiff2 = expectedEndBalance2.sub(actualEndBalance2);

        expect(balanceDiff1.toNumber(), "balanceDiff1").to.be.lt(4e14);   
        expect(balanceDiff2.toNumber(), "balanceDiff2").to.be.lt(4e14);     

        // expect(actualEndBalance1.toString(), "balance1").to.equal(ethers.utils.parseEther("1.0").add(startingBalance1).toString());   
        // expect(actualEndBalance2.toString(), "balance2").to.equal(ethers.utils.parseEther("1.0").add(startingBalance2).toString());     
      });
    });


    describe("withdrawMax()", function () {
      it("Should withdraw allocated funds", async function () {
        const startingBalance1 = await provider.getBalance(addr1.address);
        const startingBalance2 = await provider.getBalance(addr2.address);
        await distributingTreaty.connect(addr1).withdrawMax();
        await distributingTreaty.connect(addr2).withdrawMax();
        // const provider = addr0._signer.provider;
        const contractBalance = await provider.getBalance(distributingTreaty.address);
        const endingBalance1 = await provider.getBalance(addr1.address);
        const endingBalance2 = await provider.getBalance(addr2.address);
        
        const balanceDiff1 = endingBalance1.sub(startingBalance1);
        const balanceDiff2 = endingBalance2.sub(startingBalance2);
        const expectedBalanceDiff1 = ethers.utils.parseEther(Number(33.33 * 0.7 - 1).toString());
        const expectedBalanceDiff2 = ethers.utils.parseEther(Number(33.33 * 0.3 - 1).toString());
        const diffDiff1 = expectedBalanceDiff1.sub(balanceDiff1);
        const diffDiff2 = expectedBalanceDiff2.sub(balanceDiff2);
        
        // console.log('balanceDiff1 :>> ', ethers.utils.formatUnits(balanceDiff1.toString()));
        // console.log('balanceDiff2 :>> ', ethers.utils.formatUnits(balanceDiff2.toString()));
        // console.log('expectedBalanceDiff1 :>> ', ethers.utils.formatUnits(expectedBalanceDiff1.toString()));
        // console.log('expectedBalanceDiff2 :>> ', ethers.utils.formatUnits(expectedBalanceDiff2.toString()));
        // console.log('diffDiff1 :>> ', ethers.utils.formatUnits(diffDiff1.toString()));
        // console.log('diffDiff2 :>> ', ethers.utils.formatUnits(diffDiff2.toString()));

        // expect(contractBalance).to.equal(0);
        expect(diffDiff1.toNumber()).to.be.lt(4e14);   
        expect(diffDiff2.toNumber()).to.be.lt(4e14);   
 
        // expect(endingBalance1.toString()).to.equal(ethers.BigNumber.from("23331000000000000000").add(initialBalance).toString());   
        // expect(endingBalance2.toString()).to.equal(ethers.BigNumber.from("99990000000000000000").add(initalBalance).toString());     
      });
    });
  });
});
