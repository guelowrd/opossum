// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Minter is ERC1155, ERC1155Burnable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Track total number of non-fungible tokens.
    Counters.Counter internal _tokenIdTracker;

    // Contract global variables.
    uint256 public constant mintPrice = 12300000000000000; // 0.0123 ETH
    uint256 public totalMinted = 0;
    string public baseUri;
    mapping(uint256 => address) public tokenid_creator;
    mapping(uint256 => string) public tokenid_data;
    mapping(address => uint256[]) public creator_tokenids;

    // Contract constructor initializing baseURL="";
    // but maybe it could be something like "data:image/svg+xml;"?
    constructor(string memory _uri) ERC1155(_uri) {
        setURI(_uri);
        baseUri = _uri;
    }

    // The main token minting function (receives Ether).
    //
    function mint(string memory _dataStr) public payable {
        // Check that the right amount of Ether was sent.
        require(mintPrice <= msg.value, "Not enough Ether sent.");
        // Update dictionaries.
        address sender = _msgSender();
        uint256 tokenId = _tokenIdTracker.current();
        tokenid_creator[tokenId] = sender;
        tokenid_data[tokenId] = _dataStr;
        creator_tokenids[sender].push(tokenId);
        // Mint token.
        _mint(_msgSender(), tokenId, 1, "");
        // Update tracking variables.
        totalMinted++;
        _tokenIdTracker.increment();
    }

    function withdrawAll(address payable _to) public onlyOwner {
        _to.transfer(address(this).balance);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public override {
        require(false, "You cannot transfer your Opossum.");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public override {
        require(false, "You cannot transfer your Opossums.");
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function burn(address account, uint256 id, uint256 value) public override {
        super.burn(account, id, value);
        delete tokenid_creator[id];
        delete tokenid_data[id];
        uint256 nbTokens = creator_tokenids[account].length;
        for (uint256 i=0; i<nbTokens ;i++){
            if (creator_tokenids[account][i] == id) {
                creator_tokenids[account][i] = creator_tokenids[account][nbTokens-1];
                creator_tokenids[account].pop(); //we don't care about sorting
                totalMinted--;
                break;
            }
        }
    }

    function totalSupply() public view returns (uint256) {
        return totalMinted;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function ownerBalance(address _owner) public view returns (uint256) {
        return creator_tokenids[_owner].length;
    }

    function tokenOfOwnerByIndex(
        address _owner,
        uint256 _ith
    ) public view returns (uint256) {
        require(
            _ith < ownerBalance(_owner),
            "Owner does not have that many tokens."
        );
        return creator_tokenids[_owner][_ith];
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function uri(
        uint256 _tokenid
    ) public view override returns (string memory) {
        require(_exists(_tokenid), "This id does not exist.");
        return strConcat(baseUri, tokenid_data[_tokenid]);
    }

    function _exists(uint256 _id) internal view returns (bool) {
        return tokenid_creator[_id] != address(0);
    }

    function strConcat(
        string storage _a,
        string memory _b
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(_a, _b));
    }
}
