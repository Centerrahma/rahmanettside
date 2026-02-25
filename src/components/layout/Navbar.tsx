'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

const desktopLinks = [
  { key: 'prayerTimes', href: '/#prayer-times' as const },
  { key: 'newMosque', href: '/new-mosque' as const },
  { key: 'becomeMember', href: '/become-member' as const },
  { key: 'contactUs', href: '/contact' as const },
];

const dropdownLinks = [
  { key: 'rahmaSchool', href: '/services' as const },
  { key: 'ungRahma', href: '/services' as const },
  { key: 'aboutUs', href: '/heritage' as const },
];

const allLinks = [
  { key: 'rahmaSchool', href: '/services' as const },
  { key: 'ungRahma', href: '/services' as const },
  { key: 'newMosque', href: '/new-mosque' as const },
  { key: 'becomeMember', href: '/become-member' as const },
  { key: 'prayerTimes', href: '/#prayer-times' as const },
  { key: 'aboutUs', href: '/heritage' as const },
  { key: 'contactUs', href: '/contact' as const },
];

export function Navbar() {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-50 glass-nav transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size="md" />
              <span className="text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary-val)] transition-colors">
                Masjid Rahma
              </span>
            </Link>

            {/* Center Nav Links (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              {desktopLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
                >
                  {t(link.key)}
                </Link>
              ))}

              {/* More Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors duration-200"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {t('more')}
                  <span
                    className={`material-icons text-base transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    expand_more
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 min-w-[180px] glass-nav rounded-xl shadow-xl border border-[var(--color-border)] py-2">
                    {dropdownLinks.map((link) => (
                      <Link
                        key={link.key}
                        href={link.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] hover:bg-[var(--color-primary-val)]/5 transition-colors duration-200"
                      >
                        {t(link.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions (desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/donate"
                className="bg-primary text-[var(--color-bg)] px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/20"
              >
                {t('supportUs')}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary-val)] transition-colors"
              aria-label="Open menu"
            >
              <span className="material-icons">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[var(--color-bg)] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <span className="text-lg font-bold text-[var(--color-text)]">
                  Masjid Rahma
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Close menu"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 flex flex-col gap-2 px-6 py-8">
              {allLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-val)] transition-colors py-3 border-b border-[var(--color-border)]"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="px-6 pb-8 flex flex-col gap-4">
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
              <Link
                href="/donate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-primary text-[var(--color-bg)] px-6 py-3 rounded-full text-sm font-bold text-center hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/20"
              >
                {t('supportUs')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
