import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Pizza Personality Quiz',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})

// Contract ABI for minting
export const NFT_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' },
    ],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Contract address (to be set after deployment)
export const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}` | undefined
