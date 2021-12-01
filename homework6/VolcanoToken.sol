// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VolcanoToken is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("VolcanoToken", "VLT") {}

    struct TokenMetadata {
        uint256 tokenId;
        uint timestamp;
        string tokenURI;
    }

    mapping(address => TokenMetadata[]) public tokens;

    function getTokensFromAddress(address _user) public view returns (TokenMetadata[] memory) {
        return tokens[_user];
    }

    function mintToken() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        string memory nftString = "some cool nft string";
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, nftString);
        addMintedToken(msg.sender, newItemId, block.timestamp, nftString);
    }

    function burnToken(uint256 _tokenId) public {
        // make sure only token owner can burn!
        for (uint i=0; i < tokens[msg.sender].length; i++) {
            if (tokens[msg.sender][i].tokenId == _tokenId) {
                _burn(_tokenId);
                delete tokens[msg.sender][i];
            }
        }
    }

    function addMintedToken(address _owner, uint256 _tokenId, uint _timestamp, string memory _tokenURI) internal {
        tokens[_owner].push(TokenMetadata(_tokenId, _timestamp, _tokenURI));
    }

    // function handleBurn(uint256 _tokenId, address _owner) internal {
    //     // remove from mapping
    //      for (uint i=0; i < tokens[_owner].length; i++) {
    //         if (tokens[_owner][i].tokenId == _tokenId) {
    //             delete tokens[_owner][i];
    //         }
    //     }
    // }

}
