// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Score {
    uint score;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    event Score_set(uint indexed);

    function getScore() public view returns (uint) {
        return score;
    }

    function setScore(uint _newScore) public onlyOwner {
        score = _newScore;
        emit Score_set(score);
    }

    // // // //
    mapping(address => uint) score_list;

    function getUserScore(address _addr) public view returns (uint) {
        return score_list[_addr];
    }

    function setUserScore(address _addr, uint _i) public {
        score_list[_addr] = _i;
    }
}