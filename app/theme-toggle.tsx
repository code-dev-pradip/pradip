'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'site-theme';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M20.3 14.6A8.8 8.8 0 1 1 10.1 3.8a7 7 0 1 0 10.2 10.8z" fill="currentColor" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="4.8" fill="currentColor" />
      <g fill="currentColor">
        <circle cx="12" cy="2.8" r="1.05" />
        <circle cx="12" cy="21.2" r="1.05" />
        <circle cx="2.8" cy="12" r="1.05" />
        <circle cx="21.2" cy="12" r="1.05" />
        <circle cx="5.8" cy="5.8" r="1.05" />
        <circle cx="18.2" cy="18.2" r="1.05" />
        <circle cx="5.8" cy="18.2" r="1.05" />
        <circle cx="18.2" cy="5.8" r="1.05" />
      </g>
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [maskPulse, setMaskPulse] = useState(0);
  const [mask, setMask] = useState<{ x: number; y: number; color: string } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let current: Theme = 'dark';

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        current = stored;
      } else {
        const attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'light' || attr === 'dark') current = attr;
      }
    } catch {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'light' || attr === 'dark') current = attr;
    }

    applyTheme(current);
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme: Theme = current === 'dark' ? 'light' : 'dark';
      const buttonRect = buttonRef.current?.getBoundingClientRect();
      const centerX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
      const centerY = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight / 2;
      const maskColor = nextTheme === 'dark' ? 'rgba(21, 20, 18, 0.42)' : 'rgba(244, 242, 237, 0.42)';
      const root = document.documentElement;

      setMask({ x: centerX, y: centerY, color: maskColor });
      setMaskPulse((value) => value + 1);

      root.classList.add('theme-anim');
      applyTheme(nextTheme);

      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {}

      window.setTimeout(() => {
        root.classList.remove('theme-anim');
      }, 720);

      window.setTimeout(() => {
        setMask(null);
      }, 760);

      return nextTheme;
    });
  };

  const isDark = theme === 'dark';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`theme-toggle${isDark ? ' is-dark' : ''}`}
        onClick={toggleTheme}
        aria-label="Toggle color theme"
        aria-pressed={isDark}
      >
        <MoonIcon className="theme-toggle-icon theme-toggle-icon-moon" />
        <SunIcon className="theme-toggle-icon theme-toggle-icon-sun" />
      </button>
      {mask ? (
        <span
          key={maskPulse}
          className="theme-toggle-mask is-animating"
          aria-hidden="true"
          style={{ left: `${mask.x}px`, top: `${mask.y}px`, backgroundColor: mask.color }}
        />
      ) : null}
    </>
  );
}
