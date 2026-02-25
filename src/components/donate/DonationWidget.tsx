'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { DONATION_AMOUNTS, DEFAULT_AMOUNT, CURRENCY } from '@/lib/constants';

type DonationFrequency = 'one-time' | 'monthly';
type PaymentMethod = 'card' | 'apple-pay' | 'vipps';

interface DonationWidgetProps {
  title: string;
  subtitle: string;
  oneTimeLabel: string;
  monthlyLabel: string;
  customAmountLabel: string;
  confirmLabel: string;
  securityNote: string;
  processingLabel: string;
}

export default function DonationWidget({
  title,
  subtitle,
  oneTimeLabel,
  monthlyLabel,
  customAmountLabel,
  confirmLabel,
  securityNote,
  processingLabel,
}: DonationWidgetProps) {
  const locale = useLocale();
  const [selectedAmount, setSelectedAmount] = useState<number>(DEFAULT_AMOUNT);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<DonationFrequency>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError(null);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setError(null);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
    }
  };

  const handleConfirmDonation = async () => {
    if (selectedAmount <= 0) {
      setError('Please select or enter an amount greater than 0.');
      return;
    }

    if (selectedAmount < 10) {
      setError('Minimum donation amount is 10 kr.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          currency: CURRENCY,
          frequency,
          locale,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Could not create checkout session. Please try again.');
        setIsProcessing(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="material-icons text-primary text-3xl">
          volunteer_activism
        </span>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
      </div>

      {/* Frequency Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFrequency('one-time')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            frequency === 'one-time'
              ? 'bg-primary text-[var(--color-bg)]'
              : 'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)]'
          }`}
        >
          {oneTimeLabel}
        </button>
        <button
          onClick={() => setFrequency('monthly')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            frequency === 'monthly'
              ? 'bg-primary text-[var(--color-bg)]'
              : 'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)]'
          }`}
        >
          {monthlyLabel}
        </button>
      </div>

      {/* Quick amounts */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {DONATION_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAmountClick(amount)}
            className={`py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              selectedAmount === amount && !customAmount
                ? 'bg-primary text-[var(--color-bg)] border-2 border-primary'
                : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-primary/50'
            }`}
          >
            {amount} kr
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="mb-6">
        <label className="block text-xs text-[var(--color-text-muted)] mb-2">
          {customAmountLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="0"
            min="10"
            className="w-full py-3 pl-12 pr-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:border-primary transition-colors"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            kr
          </span>
        </div>
      </div>

      {/* Payment methods */}
      <div className="mb-6">
        <label className="block text-xs text-[var(--color-text-muted)] mb-3">
          Payment Method
        </label>
        <div className="space-y-2">
          {/* Card */}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'card'
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-primary/50'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="sr-only"
            />
            <span className="material-icons text-primary">credit_card</span>
            <span className="flex-1 font-semibold text-sm">Card</span>
          </label>

          {/* Apple Pay */}
          <label
            aria-disabled="true"
            className="flex items-center gap-3 p-3 rounded-lg cursor-not-allowed opacity-50 bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <input
              type="radio"
              name="payment"
              value="apple-pay"
              disabled
              className="sr-only"
            />
            <span className="material-icons text-[var(--color-text-muted)]">
              apple
            </span>
            <span className="flex-1 font-semibold text-sm text-[var(--color-text-muted)]">
              Apple Pay
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Coming soon
            </span>
          </label>

          {/* Vipps */}
          <label
            aria-disabled="true"
            className="flex items-center gap-3 p-3 rounded-lg cursor-not-allowed opacity-50 bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <input
              type="radio"
              name="payment"
              value="vipps"
              disabled
              className="sr-only"
            />
            <span className="material-icons text-[var(--color-text-muted)]">
              payment
            </span>
            <span className="flex-1 font-semibold text-sm text-[var(--color-text-muted)]">
              Vipps
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Coming soon
            </span>
          </label>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirmDonation}
        disabled={isProcessing || selectedAmount <= 0}
        className="w-full bg-primary text-[var(--color-bg)] py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isProcessing ? processingLabel : confirmLabel}</span>
        {isProcessing ? (
          <span className="material-icons text-sm animate-spin">refresh</span>
        ) : (
          <span className="material-icons text-sm">arrow_forward</span>
        )}
      </button>

      {/* Security note */}
      <div className="flex items-start gap-2 mt-4 text-xs text-[var(--color-text-muted)]">
        <span className="material-icons text-sm text-primary">lock</span>
        <span>{securityNote}</span>
      </div>
    </div>
  );
}
