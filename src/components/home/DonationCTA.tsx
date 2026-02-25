'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { DONATION_AMOUNTS, DEFAULT_AMOUNT } from '@/lib/constants';

export default function DonationCTA() {
  const t = useTranslations();
  const [selectedAmount, setSelectedAmount] = useState<number>(DEFAULT_AMOUNT);
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setSelectedAmount(parsed);
    }
  };

  return (
    <section className="py-24 bg-[var(--color-surface)] relative">
      <Container>
        <div className="bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          {/* Geometric line pattern overlay (right side, opacity-5) */}
          <div
            className="absolute right-0 top-0 w-1/2 h-full opacity-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--color-primary-val) 0, var(--color-primary-val) 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          {/* Left side: info */}
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6">
              {t('donate.sectionTitle')}
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 text-lg">
              {t('donate.sectionSubtitle')}
            </p>

            {/* Fund items with check icons */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center text-[var(--color-text)]">
                  <span className="material-icons">check</span>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">
                    {t('donate.constructionFund')}
                  </h4>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {t('donate.constructionDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center text-[var(--color-text)]">
                  <span className="material-icons">check</span>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">
                    {t('donate.educationFund')}
                  </h4>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {t('donate.educationDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: mini donation form */}
          <div className="flex-1 w-full max-w-md bg-[var(--color-bg)] p-8 rounded-xl border border-[var(--color-border)] shadow-2xl relative z-10">
            <h3 className="text-[var(--color-text)] font-bold text-xl mb-6">
              {t('donate.makeADonation')}
            </h3>

            {/* Amount buttons: 100, 500, 1000 kr */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {DONATION_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountClick(amount)}
                  className={`
                    py-3 px-4 rounded-lg transition-all duration-300
                    ${
                      selectedAmount === amount && !customAmount
                        ? 'border-2 border-primary bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-text)] font-bold'
                        : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]'
                    }
                  `.trim()}
                >
                  {amount} kr
                </button>
              ))}
            </div>

            {/* Custom Amount input */}
            <div className="mb-6">
              <label className="block text-[var(--color-text-muted)] text-sm mb-2">
                {t('donate.customAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[var(--color-text-muted)]">
                  kr
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-3 pl-10 pr-4 text-[var(--color-text)] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Donate button */}
            <Button variant="primary" size="lg" className="w-full">
              {t('donate.donateSecurely')}
            </Button>

            {/* Security note */}
            <p className="text-center text-[var(--color-text-muted)] text-xs mt-4 flex items-center justify-center gap-1">
              <span className="material-icons text-xs">lock</span>{' '}
              {t('common.securePay')}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
