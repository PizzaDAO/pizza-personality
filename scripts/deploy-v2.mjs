import solc from 'solc';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const PRIVATE_KEY = '0x9894bbf8b21d3aeec1894f45b4d6b4b8c598a6ed9eefae370df676b689f66299';

// Updated contract: one NFT per address, mintOrUpdate function
const CONTRACT_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PizzaPersonalityNFT {
    string public name = "Pizza Personality";
    string public symbol = "PIZZA";

    uint256 private _tokenIdCounter;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Track token ID for each address (one per address)
    mapping(address => uint256) private _addressToTokenId;
    mapping(address => bool) private _hasToken;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event MetadataUpdated(uint256 indexed tokenId, string uri);

    // Mint new or update existing - one NFT per address
    function mintOrUpdate(address to, string memory uri) public returns (uint256) {
        if (_hasToken[to]) {
            // Update existing token
            uint256 existingTokenId = _addressToTokenId[to];
            _tokenURIs[existingTokenId] = uri;
            emit MetadataUpdated(existingTokenId, uri);
            return existingTokenId;
        } else {
            // Mint new token
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _owners[tokenId] = to;
            _balances[to]++;
            _tokenURIs[tokenId] = uri;
            _addressToTokenId[to] = tokenId;
            _hasToken[to] = true;

            emit Transfer(address(0), to, tokenId);
            return tokenId;
        }
    }

    // Legacy mint function (always mints new)
    function mint(address to, string memory uri) public returns (uint256) {
        return mintOrUpdate(to, uri);
    }

    // Check if address has a token
    function hasToken(address owner) public view returns (bool) {
        return _hasToken[owner];
    }

    // Get token ID for an address
    function tokenOfOwner(address owner) public view returns (uint256) {
        require(_hasToken[owner], "Address has no token");
        return _addressToTokenId[owner];
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }

    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Invalid address");
        return _balances[owner];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");
        require(ownerOf(tokenId) == from, "Wrong owner");
        require(to != address(0), "Invalid recipient");

        _tokenApprovals[tokenId] = address(0);
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;

        // Update address mappings
        _hasToken[from] = false;
        _addressToTokenId[to] = tokenId;
        _hasToken[to] = true;

        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == 0x80ac58cd || // ERC721
               interfaceId == 0x5b5e139f || // ERC721Metadata
               interfaceId == 0x01ffc9a7;   // ERC165
    }
}
`;

async function compile() {
  console.log('Compiling contract v2...\n');

  const input = {
    language: 'Solidity',
    sources: {
      'PizzaPersonalityNFT.sol': {
        content: CONTRACT_SOURCE,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    if (errors.length > 0) {
      console.error('Compilation errors:');
      errors.forEach(e => console.error(e.formattedMessage));
      throw new Error('Compilation failed');
    }
  }

  const contract = output.contracts['PizzaPersonalityNFT.sol']['PizzaPersonalityNFT'];
  return {
    abi: contract.abi,
    bytecode: '0x' + contract.evm.bytecode.object,
  };
}

async function deploy() {
  const { abi, bytecode } = await compile();

  console.log('Deploying Pizza Personality NFT v2 to Base...\n');

  const account = privateKeyToAccount(PRIVATE_KEY);
  console.log('Deployer address:', account.address);

  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log('Balance:', (Number(balance) / 1e18).toFixed(6), 'ETH\n');

  if (balance === 0n) {
    throw new Error('No balance - please fund the wallet first');
  }

  console.log('Deploying contract...');
  console.log('Bytecode size:', bytecode.length / 2, 'bytes\n');

  const hash = await walletClient.deployContract({
    abi,
    bytecode,
  });

  console.log('Transaction hash:', hash);
  console.log('Waiting for confirmation...\n');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.contractAddress) {
    console.log('✅ Contract v2 deployed!');
    console.log('Contract address:', receipt.contractAddress);
    console.log('Block:', receipt.blockNumber.toString());
    console.log('\nBaseScan:', `https://basescan.org/address/${receipt.contractAddress}`);
    return receipt.contractAddress;
  } else {
    throw new Error('Contract deployment failed');
  }
}

deploy()
  .then((address) => {
    console.log('\n📋 New contract address:', address);
  })
  .catch((error) => {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  });
