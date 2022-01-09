const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("DeFi", () => {
  let owner;
  let ownerStartBalance;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = 999999999000000;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);

    // const symbol = await DAI_TokenContract.symbol();
    // const usdcSymbol = await USDC_TokenContract.symbol();
    // console.log(symbol);
    // console.log(usdcSymbol);

    const DeFi = await ethers.getContractFactory("DeFi");

    ownerStartBalance = await DAI_TokenContract.balanceOf(owner.address);

    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      BigInt(INITIAL_AMOUNT)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {
    const ownerBalanceAfterTransfer = await DAI_TokenContract.balanceOf(owner.address);
    expect(ownerBalanceAfterTransfer - ownerStartBalance).to.equal(999999999000000);
  });

  it("should sendDAI to contract", async () => {
    const DeFi_Instance_Addr = await DeFi_Instance.address;

    await DAI_TokenContract.transfer(
      DeFi_Instance_Addr,
      BigInt(INITIAL_AMOUNT)
    );

    const balanceOfDefiContract = await DAI_TokenContract.balanceOf(DeFi_Instance_Addr);
    console.log('balanceOfDefiContract', balanceOfDefiContract)
    expect(balanceOfDefiContract).to.equal(999999999000000);
  });

  it.only("should make a swap", async () => {
    // const DeFi_Instance_Addr = await DeFi_Instance.address;

    // await DAI_TokenContract.transfer(
    //   DeFi_Instance_Addr,
    //   BigInt(INITIAL_AMOUNT)
    // );

    // const balanceOfDefiContract = await DAI_TokenContract.balanceOf(DeFi_Instance_Addr);
    const ownerStartDAI = await DAI_TokenContract.balanceOf(owner.address);
    console.log('ownerStartDAI', ownerStartDAI)


    const tx1 = await DeFi_Instance.swapDAItoUSDC(999999999000000);
    console.log('tx1', tx1)

    const ownerEndDAI = await DAI_TokenContract.balanceOf(owner.address);
    console.log('ownerEndDAI', ownerEndDAI)


  });
});
