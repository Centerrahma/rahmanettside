'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import k from './reveal.module.css';

/** Style for one revealed part: its place in the stagger. */
export const r = (i: number) => ({ 'data-r': '', style: { '--i': i } as CSSProperties });

/** Marks the section with data-in once a fifth of it is on screen; CSS staggers its parts from there.
    Without script the attribute is never needed: the CSS only hides parts under [data-js]. */
export function Reveal({ as: Tag = 'section', className, children, ...rest }: { as?: 'section' | 'div'; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute('data-js', '');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.setAttribute('data-in', ''); io.disconnect(); }
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref as never} className={`${k.rv} ${className ?? ''}`} {...rest}>{children}</Tag>;
}
