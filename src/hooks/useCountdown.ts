'use client';

import { useState, useEffect } from 'react';

interface CountdownResult {
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
}

export function useCountdown(targetTime: string | null): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    totalSeconds: 0,
  });

  useEffect(() => {
    if (!targetTime) return;

    function calculate() {
      const now = new Date();
      const [hours, minutes] = targetTime!.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setCountdown({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0'),
        totalSeconds: diff,
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return countdown;
}
