import React, { useState } from 'react';
import { Loader2, Check, AlertCircle, ExternalLink, Send } from 'lucide-react';
import { useMintNFT, MintStatus } from '../hooks/useMintNFT';
import { PizzaType, PizzaResult } from '../types/quiz';

interface MintButtonProps {
  pizzaType: PizzaType;
  percentages: {
    entrepreneur: number;
    manager: number;
    technician: number;
  };
  result: PizzaResult;
  resultsRef: React.RefObject<HTMLDivElement>;
}

const statusConfig: Record<MintStatus, { text: string; icon: React.ReactNode; disabled: boolean }> = {
  idle: { text: 'Mint & Send NFT', icon: <Send size={20} />, disabled: false },
  capturing: { text: 'Capturing...', icon: <Loader2 size={20} className="animate-spin" />, disabled: true },
  uploading: { text: 'Uploading...', icon: <Loader2 size={20} className="animate-spin" />, disabled: true },
  minting: { text: 'Minting...', icon: <Loader2 size={20} className="animate-spin" />, disabled: true },
  success: { text: 'Minted!', icon: <Check size={20} />, disabled: false },
  error: { text: 'Try Again', icon: <AlertCircle size={20} />, disabled: false },
};

const MintButton: React.FC<MintButtonProps> = ({
  pizzaType,
  percentages,
  result,
  resultsRef,
}) => {
  const [recipientInput, setRecipientInput] = useState('');
  const { status, result: mintResult, mint, reset } = useMintNFT();
  const config = statusConfig[status];

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
          onChange={(e) => setRecipientInput(e.target.value)}
          disabled={isInputDisabled}
          placeholder="0x... or name.eth"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <button
        onClick={handleClick}
        disabled={config.disabled}
        className={`flex-1 ${getButtonStyle()} text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
      >
        {config.icon}
        {status === 'success' ? (mintResult.isUpdate ? 'Updated!' : 'Minted!') : config.text}
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
