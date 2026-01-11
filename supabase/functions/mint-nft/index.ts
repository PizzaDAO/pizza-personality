import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createPublicClient, createWalletClient, http, isAddress } from 'https://esm.sh/viem@2.21.0'
import { privateKeyToAccount } from 'https://esm.sh/viem@2.21.0/accounts'
import { base, mainnet } from 'https://esm.sh/viem@2.21.0/chains'
import { normalize } from 'https://esm.sh/viem@2.21.0/ens'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Contract ABI for minting (mintOrUpdate creates new or updates existing)
const NFT_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' },
    ],
    name: 'mintOrUpdate',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'hasToken',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipient, metadata, imageUrl } = await req.json()

    // Validate inputs
    if (!recipient) {
      throw new Error('Recipient address is required')
    }
    if (!metadata) {
      throw new Error('Metadata is required')
    }

    // Get environment variables
    const PRIVATE_KEY = Deno.env.get('MINTER_PRIVATE_KEY')
    const CONTRACT_ADDRESS = Deno.env.get('NFT_CONTRACT_ADDRESS')
    const RPC_URL = Deno.env.get('BASE_RPC_URL') || 'https://mainnet.base.org'

    if (!PRIVATE_KEY) {
      throw new Error('Minter private key not configured')
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    // Create clients
    const publicClient = createPublicClient({
      chain: base,
      transport: http(RPC_URL),
    })

    // Create mainnet client for ENS resolution
    const mainnetClient = createPublicClient({
      chain: mainnet,
      transport: http('https://eth.llamarpc.com'),
    })

    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(RPC_URL),
    })

    // Resolve recipient address (ENS or direct)
    let recipientAddress: `0x${string}`

    if (isAddress(recipient)) {
      recipientAddress = recipient as `0x${string}`
    } else if (recipient.includes('.')) {
      // Resolve ENS name using mainnet
      const resolved = await mainnetClient.getEnsAddress({
        name: normalize(recipient),
      })
      if (!resolved) {
        throw new Error(`Could not resolve ENS name: ${recipient}`)
      }
      recipientAddress = resolved
    } else {
      throw new Error('Invalid address or ENS name')
    }

    // Create metadata JSON
    const metadataJson = {
      name: metadata.name || 'Pizza Personality NFT',
      description: metadata.description || '',
      image: imageUrl,
      attributes: metadata.attributes || [],
    }

    // Create data URI for metadata
    const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadataJson))}`

    // Check if address already has a token (to determine if this is an update)
    const hadTokenBefore = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: NFT_CONTRACT_ABI,
      functionName: 'hasToken',
      args: [recipientAddress],
    })

    // Mint or update NFT (one per address)
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: NFT_CONTRACT_ABI,
      functionName: 'mintOrUpdate',
      args: [recipientAddress, metadataUri],
    })

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    return new Response(
      JSON.stringify({
        success: true,
        txHash: hash,
        recipient: recipientAddress,
        blockNumber: receipt.blockNumber.toString(),
        isUpdate: hadTokenBefore,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Mint error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
