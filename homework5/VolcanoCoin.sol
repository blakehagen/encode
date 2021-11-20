// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract VolcanoCoin is Ownable, ERC20 {
    constructor() ERC20("VolcanoCoin", "VLC") {
        _mint(msg.sender, 10000);
    }

    struct Payment {
        address sender;
        address recipient;
        uint amount;
    }

    Payment[] public payments;


    function mintTokensToOwner() public onlyOwner {
        _mint(msg.sender, 10000);
    }

    function addPaymentRecord(address _sender, address _recipient, uint _amt) public {
        Payment memory newPayment = Payment(_sender, _recipient, _amt);
        payments.push(newPayment);

    }
}
