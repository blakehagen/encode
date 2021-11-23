// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint256 public totalSupply;
    address owner;

    mapping(address => uint) public balances;
    mapping(address => Payment[]) public payments;

    struct Payment {
        address recipient;
        uint256 amount;
    }

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    event supplyChanged(uint indexed);
    event Transfer(address indexed, uint256);

    constructor() {
        totalSupply = 10000;
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    function updateTotalSupply() public onlyOwner {
        totalSupply = totalSupply + 1000;
        emit supplyChanged(totalSupply);
    }

    function transfer(address _recipient, uint256 _amt) public {
        require(balances[msg.sender] >= _amt,"Insufficient balance to make transfer.");
        balances[msg.sender] -= _amt;
        balances[_recipient] += _amt;
        emit Transfer(_recipient, _amt);

        Payment memory payment;
        payment.recipient = _recipient;
        payment.amount = _amt;
        payments[msg.sender].push(payment);
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }
}
