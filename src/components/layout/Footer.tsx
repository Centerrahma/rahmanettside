'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Mail } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-lg font-bold text-[var(--color-text)]">
                Masjid Rahma
              </span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              {t('brand')}
            </p>
            <p className="text-[var(--color-text-muted)] text-xs">
              Organisasjonsnummer: 974444216
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#prayer-times"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
                >
                  {tn('prayerTimes')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
                >
                  {t('linkContact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/new-mosque"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
                >
                  {t('linkNewMosque')}
                </Link>
              </li>
              <li>
                <Link
                  href="/become-member"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
                >
                  {t('linkBecomeMember')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] mb-4">
              {t('contactUs')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-[18px] h-[18px] text-[var(--color-primary-val)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">
                  Tvetenveien 154, 0671 Oslo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-[18px] h-[18px] text-[var(--color-primary-val)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">
                  post@centerrahma.no
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
            >
              {t('privacyPolicy')}
            </a>
            <a
              href="#"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
            >
              {t('termsOfService')}
            </a>
          </div>
        </div>

        {/* Credit */}
        <div className="text-center mt-6">
          <p className="text-xs text-[var(--color-text-muted)]">
            Nettsiden er laget av{' '}
            <a
              href="https://www.idweb.no"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-primary-val)] transition-colors duration-200"
            >
              IDweb
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
