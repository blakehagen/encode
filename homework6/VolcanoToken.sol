// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract VolcanoToken is Ownable, ERC721 {
    constructor() ERC721("VolcanoToken", "VLT") {
        _safeMint(msg.sender, 2);
    }

    uint256 tokenId;

    struct TokenMetadata {
        uint256 tokenId;
        uint timestamp;
        string tokenURI;
    }

    mapping(address => TokenMetadata[]) public tokens; // TODO => how to create an array of structs as the value of a mapping

}
