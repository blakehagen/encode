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

    mapping(address => uint) score_list;

    function getScore() public view returns (uint) {
        return score;
    }

    function setScore(uint _newScore) public onlyOwner {
        score = _newScore;
        emit Score_set(score);
    }

    function getUserScore(address user) public view returns (uint) {
        return score_list[user];
    }
}