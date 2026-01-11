// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PizzaPersonalityNFT
 * @dev ERC721 NFT contract for Pizza Personality Quiz results
 *
 * Deployment:
 * 1. Deploy to Base mainnet using Foundry, Hardhat, or Remix
 * 2. Set the contract address in your .env as VITE_CONTRACT_ADDRESS
 *
 * For gasless minting via Coinbase Smart Wallet:
 * - Coinbase Smart Wallet automatically sponsors gas on Base
 * - Users connecting via Coinbase Wallet get free transactions
 */
contract PizzaPersonalityNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Pizza Personality", "PIZZA") Ownable(msg.sender) {}

    /**
     * @dev Mints a new NFT with the given tokenURI
     * @param to The address to mint the NFT to
     * @param uri The metadata URI for the NFT
     * @return The token ID of the newly minted NFT
     */
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        return tokenId;
    }

    /**
     * @dev Returns the tokenURI for a given token
     * @param tokenId The token ID to query
     * @return The metadata URI for the token
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Returns the current token count
     * @return The total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
