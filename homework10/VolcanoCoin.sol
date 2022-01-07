// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract VolcanoCoin is Ownable, ERC20 {
    uint256  constant initialSupply = 10000;
    address admin;

    constructor() ERC20("VolcanoCoin", "VLC") {
        _mint(msg.sender, initialSupply);
        admin = msg.sender;
    }

    enum paymentType {
        Unknown,
        BasicPayment,
        Refund,
        Dividend,
        GroupPayment
    }

    struct Payment {
        uint256 timestamp;
        uint256 amount;
        uint256 id;
        address recipient;
        paymentType payType;
        string comment;
    }

    mapping (address => Payment[]) public payments;
    event supplyChanged(uint256);

    function transfer(address _recipient, uint256 _amount) public virtual override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addPaymentRecord(msg.sender, _recipient, _amount);
        return true;
    }

    function addPaymentRecord(address _sender, address _recipient, uint256 _amount) internal {
        payments[_sender].push(Payment(
                block.timestamp,
                _amount,
                payments[_sender].length + 1,
                _recipient,
                paymentType.Unknown,
                ""
            ));
    }

    function getPaymentsByAddress(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }

    function getMyPayments() public view returns(Payment[] memory) {
        return payments[msg.sender];
    }

    function updateMyPaymentData(uint256 _paymentId, paymentType _paymentType, string memory _comment) public {
        // TODO: Check that required params passed in
        payments[msg.sender][_paymentId - 1].payType = _paymentType;
        payments[msg.sender][_paymentId - 1].comment = _comment;
    }

    function updatePaymentDataByAdmin(address _userAddress, uint256 _paymentId, paymentType _paymentType) public {
        require(msg.sender == admin, "Only the adminstrator can do this!");
        // TODO: Check that required params passed in
        payments[_userAddress][_paymentId - 1].payType = _paymentType;
        // TODO -> payments[_userAddress][_paymentId - 1].comment = `${payments[_userAddress][_paymentId - 1].comment} - record updated by {admin}`;
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }

    function updateAdmin(address _newAdmin) public onlyOwner {
        admin = _newAdmin;
    }
}
