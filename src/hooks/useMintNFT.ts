import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { uploadImage, storeMetadata, NFTMetadata } from '../lib/supabase';
import { PizzaType } from '../types/quiz';

export type MintStatus =
  | 'idle'
  | 'capturing'
  | 'uploading'
  | 'minting'
  | 'success'
  | 'error';

interface MintResult {
  txHash?: string;
  recipient?: string;
  tokenId?: string;
  isUpdate?: boolean;
  error?: string;
}

const NFT_CONTRACT_ADDRESS = '0x547d2d5eff22ba9fb51ce0c20201258a684f2e6b';

const tokenOfOwnerAbi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'tokenOfOwner',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface UseMintNFTProps {
  pizzaType: PizzaType;
  percentages: {
    entrepreneur: number;
    organizer: number;
    technician: number;
  };
  traits: string[];
  pizzaName: string;
  emythType: string;
  recipient: string; // ETH address or ENS name
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useMintNFT() {
  const [status, setStatus] = useState<MintStatus>('idle');
  const [result, setResult] = useState<MintResult>({});

  const mint = useCallback(async (
    resultsRef: React.RefObject<HTMLDivElement>,
    props: UseMintNFTProps
  ) => {
    try {
      // Step 1: Capture results as image
      setStatus('capturing');
      if (!resultsRef.current) {
        throw new Error('Results element not found');
      }

      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Apply rounded corner mask for transparent corners
      const radius = 24 * 2; // rounded-3xl is ~24px, scale by 2
      const maskedCanvas = document.createElement('canvas');
      maskedCanvas.width = canvas.width;
      maskedCanvas.height = canvas.height;
      const ctx = maskedCanvas.getContext('2d');

      if (ctx) {
        // Draw rounded rectangle mask
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();

        // Draw the original canvas within the clipped area
        ctx.drawImage(canvas, 0, 0);
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        maskedCanvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          'image/png'
        );
      });

      // Step 2: Upload image to Supabase
      setStatus('uploading');
      const timestamp = Date.now();
      const fileName = `${props.recipient.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.png`;
      const imageUrl = await uploadImage(blob, fileName);

      // Step 3: Store metadata in Supabase
      const metadata: NFTMetadata = {
        wallet_address: props.recipient.toLowerCase(),
        pizza_type: props.pizzaType,
        percentages: props.percentages,
        traits: props.traits,
        image_url: imageUrl,
      };

      await storeMetadata(metadata);

      // Step 4: Call Edge Function to mint
      setStatus('minting');

      const nftMetadata = {
        name: `Pizza Personality: ${props.pizzaName}`,
        description: `${props.emythType} - ${props.traits.join(', ')}`,
        attributes: [
          { trait_type: 'Pizza Type', value: props.pizzaName },
          { trait_type: 'Personality', value: props.emythType },
          { trait_type: 'Dreamer', value: props.percentages.entrepreneur, display_type: 'number' },
          { trait_type: 'Artist', value: props.percentages.technician, display_type: 'number' },
          { trait_type: 'Organizer', value: props.percentages.organizer, display_type: 'number' },
          ...props.traits.map((trait, i) => ({ trait_type: `Trait ${i + 1}`, value: trait })),
        ],
      };

      const response = await fetch(`${SUPABASE_URL}/functions/v1/mint-nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          recipient: props.recipient,
          metadata: nftMetadata,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Minting failed');
      }

      // Fetch token ID for the recipient with retry logic
      const publicClient = createPublicClient({
        chain: base,
        transport: http('https://mainnet.base.org'),
      });

      let tokenId: bigint | undefined;
      let attempts = 0;
      const maxAttempts = 5;

      // Try to fetch token ID with retries (blockchain state may take a moment to update)
      while (attempts < maxAttempts && !tokenId) {
        try {
          tokenId = await publicClient.readContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: tokenOfOwnerAbi,
            functionName: 'tokenOfOwner',
            args: [data.recipient as `0x${string}`],
          });
        } catch (error) {
          attempts++;
          if (attempts < maxAttempts) {
            // Wait a bit before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          } else {
            // If we can't get the token ID after retries, that's okay - the mint still succeeded
            console.warn('Could not fetch tokenId after', maxAttempts, 'attempts, but mint succeeded');
          }
        }
      }

      setStatus('success');
      setResult({
        txHash: data.txHash,
        recipient: data.recipient,
        tokenId: tokenId?.toString(),
        isUpdate: data.isUpdate
      });

      return {
        txHash: data.txHash,
        tokenId: tokenId?.toString(),
        isUpdate: data.isUpdate
      };
    } catch (error) {
      console.error('Mint error:', error);
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({ error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult({});
  }, []);

  return {
    status,
    result,
    mint,
    reset,
  };
}
