import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Check, AlertCircle, ExternalLink, Send } from 'lucide-react';
import { createPublicClient, http, isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { useMintNFT, MintStatus } from '../hooks/useMintNFT';
import { PizzaType, PizzaResult } from '../types/quiz';

const NFT_CONTRACT_ADDRESS = '0x547d2d5eff22ba9fb51ce0c20201258a684f2e6b';

const hasTokenAbi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'hasToken',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface MintButtonProps {
  pizzaType: PizzaType;
  percentages: {
    entrepreneur: number;
    organizer: number;
    technician: number;
  };
  result: PizzaResult;
  resultsRef: React.RefObject<HTMLDivElement>;
}

const getStatusConfig = (isUpdate: boolean): Record<MintStatus, { text: string; icon: React.ReactNode; disabled: boolean }> => ({
  idle: { text: isUpdate ? 'Update NFT' : 'Mint & Send NFT', icon: <Send size={20} />, disabled: false },
  capturing: { text: 'Capturing...', icon: <Loader2 size={20} className="animate-spin" />, disabled: true },
  uploading: { text: 'Uploading...', icon: <Loader2 size={20} className="animate-spin" />, disabled: true },
  minting: { text: isUpdate ? 'Updating...' : 'Minting...', icon: <Loader2 size={20} className="animate-spin" />, disabled: true },
  success: { text: isUpdate ? 'Updated!' : 'Minted!', icon: <Check size={20} />, disabled: false },
  error: { text: 'Try Again', icon: <AlertCircle size={20} />, disabled: false },
});

const MintButton: React.FC<MintButtonProps> = ({
  pizzaType,
  percentages,
  result,
  resultsRef,
}) => {
  const [recipientInput, setRecipientInput] = useState('');
  const [willBeUpdate, setWillBeUpdate] = useState(false);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const { status, result: mintResult, mint, reset } = useMintNFT();

  // Track the latest address we're checking to avoid race conditions
  const latestCheckRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use willBeUpdate for progress states, but use mintResult.isUpdate for final success state
  const isUpdate = status === 'success' ? (mintResult.isUpdate ?? false) : willBeUpdate;
  const config = getStatusConfig(isUpdate)[status];

  const checkIfHasToken = async (address: string) => {
    if (!address.trim()) {
      setWillBeUpdate(false);
      setCheckingAddress(false);
      return;
    }

    // Mark this as the address we're checking
    latestCheckRef.current = address;
    setCheckingAddress(true);

    try {
      let resolvedAddress: `0x${string}` | null = null;

      if (isAddress(address)) {
        resolvedAddress = address as `0x${string}`;
      } else if (address.includes('.')) {
        // Resolve ENS name
        const mainnetClient = createPublicClient({
          chain: mainnet,
          transport: http('https://eth.llamarpc.com'),
        });
        try {
          resolvedAddress = await mainnetClient.getEnsAddress({
            name: normalize(address),
          });
        } catch {
          // Invalid ENS name, ignore
          resolvedAddress = null;
        }
      }

      // Only update state if this is still the latest check
      if (latestCheckRef.current !== address) {
        return;
      }

      if (resolvedAddress) {
        const publicClient = createPublicClient({
          chain: base,
          transport: http('https://mainnet.base.org'),
        });

        const hasToken = await publicClient.readContract({
          address: NFT_CONTRACT_ADDRESS,
          abi: hasTokenAbi,
          functionName: 'hasToken',
          args: [resolvedAddress],
        });

        // Only update state if this is still the latest check
        if (latestCheckRef.current === address) {
          setWillBeUpdate(hasToken);
          setCheckingAddress(false);
        }
      } else {
        if (latestCheckRef.current === address) {
          setWillBeUpdate(false);
          setCheckingAddress(false);
        }
      }
    } catch (error) {
      console.error('Error checking token:', error);
      if (latestCheckRef.current === address) {
        setWillBeUpdate(false);
        setCheckingAddress(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientInput(value);

    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Check immediately for full addresses, debounce for ENS names
    if (isAddress(value)) {
      checkIfHasToken(value);
    } else if (value.includes('.') && value.length > 4) {
      // Debounce ENS lookups by 500ms to wait for user to finish typing
      setCheckingAddress(true);
      debounceTimerRef.current = setTimeout(() => {
        checkIfHasToken(value);
      }, 500);
    } else {
      latestCheckRef.current = '';
      setWillBeUpdate(false);
      setCheckingAddress(false);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClick = async () => {
    if (status === 'success') {
      // Open BaseScan link
      if (mintResult.txHash) {
        window.open(`https://basescan.org/tx/${mintResult.txHash}`, '_blank');
      }
      return;
    }

    if (status === 'error') {
      reset();
      return;
    }

    if (!recipientInput.trim()) {
      alert('Please enter an ETH address or ENS name');
      return;
    }

    try {
      await mint(resultsRef, {
        pizzaType,
        percentages,
        traits: result.traits,
        pizzaName: result.pizzaName,
        emythType: result.emythType,
        recipient: recipientInput.trim(),
      });
    } catch (error) {
      // Error is handled in the hook
      console.error('Mint failed:', error);
    }
  };

  const isInputDisabled = status !== 'idle' && status !== 'error';

  const getButtonStyle = () => {
    if (status === 'success') {
      return 'bg-green-600 hover:bg-green-700';
    }
    if (status === 'error') {
      return 'bg-orange-600 hover:bg-orange-700';
    }
    return 'bg-purple-600 hover:bg-purple-700';
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Recipient input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-white">
          Send NFT to:
        </label>
        <input
          type="text"
          value={recipientInput}
          onChange={handleInputChange}
          disabled={isInputDisabled}
          placeholder="0x... or name.eth"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <span className="text-xs text-white h-4">
          {checkingAddress && 'Checking address...'}
          {!checkingAddress && willBeUpdate && status === 'idle' && 'This address already has an NFT - it will be updated'}
        </span>
      </div>

      <button
        onClick={handleClick}
        disabled={config.disabled}
        className={`flex-1 ${getButtonStyle()} text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
      >
        {config.icon}
        {config.text}
      </button>

      {/* Success state - show links */}
      {status === 'success' && mintResult.tokenId && (
        <div className="flex gap-2 justify-center">
          <a
            href={`https://opensea.io/item/base/0x547d2d5eff22ba9fb51ce0c20201258a684f2e6b/${mintResult.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white hover:text-gray-200 flex items-center gap-1"
          >
            View on OpenSea <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Error state - show message */}
      {status === 'error' && mintResult.error && (
        <p className="text-sm text-red-600 text-center">
          {mintResult.error}
        </p>
      )}
    </div>
  );
};

export default MintButton;
