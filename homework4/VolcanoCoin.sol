// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint totalSupply;
    address owner;

    struct Payment {
        address recipient;
        uint amount;
    }

    // Payment[] public payments;

    constructor() {
        totalSupply = 10000;
        owner = msg.sender;
        balance[owner] = totalSupply;
    }

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    event TotalSupplyIncrease(uint indexed);
    event Transfer(address, uint indexed);


    mapping(address => uint) public balance;
    // mapping(address => Payment[]) public paymentRecords; TODO => how to create an array of structs as the value of a mapping


    function getTotalSupply() public view returns (uint) {
        return totalSupply;
    }

    function tranfser(uint _amt, address _recipient) public {
        if(balance[msg.sender] >= _amt) {
            balance[_recipient] += _amt;
            balance[msg.sender] = balance[msg.sender] - _amt;
            emit Transfer(_recipient, balance[_recipient]);
            // paymentRecords[msg.sender].push(Payment(_recipient, _amt)); TODO => how to add a Payment to the `paymentRecords` mapping when a transfer is made
        } else {
            require(balance[msg.sender] >= _amt,"Insufficient balance to make transfer.");
        }
    }
}
