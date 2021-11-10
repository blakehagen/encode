// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint totalSupply;
    address owner;

    constructor() {
        totalSupply = 10000;
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    event TotalSupplyIncrease(uint indexed);

    function getTotalSupply() public view returns (uint) {
        return totalSupply;
    }

    function increaseSupplyBy1000() public onlyOwner {
        totalSupply = totalSupply + 1000;
        emit TotalSupplyIncrease(totalSupply);
    }
}
