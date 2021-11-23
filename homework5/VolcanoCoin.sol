// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract VolcanoCoin is Ownable, ERC20 {
    uint256  constant initialSupply = 10000;

    constructor() ERC20("VolcanoCoin", "VLC") {
        _mint(msg.sender, initialSupply);
    }

    struct Payment {
        uint256 amount;
        address recipient;
    }

    mapping (address => Payment[]) public payments;
    event supplyChanged(uint256);

    function transfer(address _recipient, uint256 _amount) public virtual override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addPaymentRecord(msg.sender, _recipient, _amount);
        return true;
    }

    function addPaymentRecord(address _sender, address _recipient, uint256 _amount) internal {
        payments[_sender].push(Payment(_amount,_recipient ));
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }
}
