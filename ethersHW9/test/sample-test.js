const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const {
        constants, // Common constants, like the zero address and largest integers
        expectRevert, // Assertions for transactions that should fail
      } = require("@openzeppelin/test-helpers");

const { solidity } = require("ethereum-waffle");
use(solidity);

// https://www.chaijs.com/guide/styles/
// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html

describe("Volcano Coin", () => {
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    expect(contractName).to.equal("Volcano Coin");
  });

  it("reverts when transferring tokens to the zero address", async () => {
    await expectRevert(
      volcanoContract.transfer(constants.ZERO_ADDRESS, 10),
      "ERC20: transfer to the zero address"
    );
  });

  it("has owner", async () => {
    let contractOwner = await volcanoContract.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  //homework
  it("has a symbol", async () => {
    let symbol = await volcanoContract.symbol();
    expect(symbol).to.equal("VLC");
  });
  
  it("has 18 decimals", async () => {
    let decimals = await volcanoContract.decimals();
    expect(decimals).to.equal(18);
  });

  it("assigns initial balance", async () => {
    let totalSupply = await volcanoContract.totalSupply();
    expect(totalSupply).to.equal(100000);

    let ownerBalance = await volcanoContract.balanceOf(owner.address);
    expect(ownerBalance).to.equal(100000);
  });

  it("increases allowance for address1", async () => {
    let increaseBy = 10;
    let allowanceBefore = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );

    let tx = await volcanoContract.increaseAllowance(addr1.address, increaseBy);
    await tx.wait();

    let allowanceAfter = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );

    expect(allowanceAfter - allowanceBefore).to.equal(increaseBy);
  });

  it("decreases allowance for address1", async () => {
    let increaseBy = 10;
    let tx1 = await volcanoContract.increaseAllowance(addr1.address, increaseBy);
    await tx1.wait();

    let allowance = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );

    let decreaseBy = 3;
    let tx2 = await volcanoContract.decreaseAllowance(
      addr1.address,
      decreaseBy
    );
    await tx2.wait();

    let allowanceAfter = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );

    expect(allowance - allowanceAfter).to.equal(decreaseBy);

  });

  it("emits an event when increasing allowance", async () => {
    let tx = await volcanoContract.increaseAllowance(addr1.address, 50);
    await expect(tx).to.emit(volcanoContract, "Approval");
  });

  it("reverts decreaseAllowance when trying decrease below 0", async () => {
    await expectRevert(
      volcanoContract.decreaseAllowance(addr1.address, 50),
      "ERC20: decreased allowance below zero"
    );
  });

  it("updates balances on successful transfer from owner to addr1", async () => {
    let transferAmount = 50;
    let ownerStartBalance = await volcanoContract.balanceOf(owner.address);

    let tx = await volcanoContract.transfer(addr1.address, transferAmount);
    await tx.wait();

    let ownerBalanceEnd = await volcanoContract.balanceOf(owner.address);
    let addr1BalanceEnd = await volcanoContract.balanceOf(addr1.address);

    expect(ownerStartBalance - ownerBalanceEnd).to.equal(transferAmount);
    expect(addr1BalanceEnd).to.equal(transferAmount);
  });

  it("reverts transfer when sender does not have enough balance", async () => {
    await expectRevert(
      volcanoContract.connect(addr1).transfer(addr2.address, 50),
      "ERC20: transfer amount exceeds balance"
    );
  });

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {
    await expect(
      volcanoContract.transferFrom(addr1.address, addr2.address, 500)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {
    let transferValue = 500;
    let tx = await volcanoContract.transfer(addr1.address, transferValue);
    await tx.wait();

    let addr1BalanceBefore = await volcanoContract.balanceOf(addr1.address);
    let addr2BalanceBefore = await volcanoContract.balanceOf(addr2.address);

    let tx2 = await volcanoContract.connect(addr1).increaseAllowance(owner.address, transferValue);
    await tx2.wait();

    let tx3 = await volcanoContract.transferFrom(addr1.address, addr2.address, transferValue);
    await tx3.wait();

    let addr1BalanceAfter = await volcanoContract.balanceOf(addr1.address);
    let addr2BalanceAfter = await volcanoContract.balanceOf(addr2.address);

    expect(addr1BalanceBefore - addr1BalanceAfter).to.equal(transferValue);
    expect(addr2BalanceAfter - addr2BalanceBefore).to.equal(transferValue);
  });
});
