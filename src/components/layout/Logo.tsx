'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-20 h-12',
  md: 'w-28 h-14 md:w-44 md:h-20',
  lg: 'w-36 h-16 md:w-52 md:h-24',
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`relative overflow-hidden ${sizeMap[size]} ${className}`}>
      {/* Light mode logo (white background) */}
      <Image
        src="/hvit rahma oppskalert.png"
        alt="Masjid Rahma Logo"
        fill
        className="object-contain block dark:hidden"
      />
      {/* Dark mode logo (transparent background) */}
      <Image
        src="/gjennomsiktig rahma oppskalert.png"
        alt="Masjid Rahma Logo"
        fill
        className="object-contain hidden dark:block"
      />
    </div>
  );
}
