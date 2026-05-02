'use client';

import { useEffect, useMemo, useState } from 'react';

const BOOT_LINES = [
  'BOOTING: PRADIP-PORTFOLIO.OS',
  'LOADING UI MODULES...',
  'LOADING PROJECT BOARD...',
  'SYNCING INTERACTIONS...',
  'READY'
];

export default function PixelLoader() {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  const activeLine = useMemo(() => {
    if (progress < 20) return BOOT_LINES[0];
    if (progress < 40) return BOOT_LINES[1];
    if (progress < 65) return BOOT_LINES[2];
    if (progress < 95) return BOOT_LINES[3];
    return BOOT_LINES[4];
  }, [progress]);

  useEffect(() => {
    const minDurationMs = 8000;
    const hardTimeoutMs = 12000;
    const startedAt = performance.now();
    let closed = false;
    let pageLoaded = document.readyState === 'complete';
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let closeId: ReturnType<typeof setTimeout> | null = null;
    let hardTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const closeLoader = () => {
      if (closed) return;
      closed = true;
      setProgress(100);
      setClosing(true);
      closeId = setTimeout(() => setVisible(false), 420);
    };

    const tick = () => {
      if (closed) return;
      const elapsed = performance.now() - startedAt;
      const normalized = Math.min(95, Math.floor((elapsed / minDurationMs) * 95));

      setProgress((current) => (normalized > current ? normalized : current));

      if ((pageLoaded && elapsed >= minDurationMs) || elapsed >= hardTimeoutMs) {
        closeLoader();
        return;
      }

    };

    const onLoaded = () => {
      pageLoaded = true;
    };

    if (!pageLoaded) {
      window.addEventListener('load', onLoaded, { once: true });
    }

    intervalId = setInterval(tick, 90);
    hardTimeoutId = setTimeout(() => closeLoader(), hardTimeoutMs + 1200);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (closeId) clearTimeout(closeId);
      if (hardTimeoutId) clearTimeout(hardTimeoutId);
      window.removeEventListener('load', onLoaded);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`pixel-loader${closing ? ' is-closing' : ''}`} role="status" aria-live="polite">
      <div className="pixel-loader-panel">
        <div className="pixel-loader-header">
          <span>PORTFOLIO_TERMINAL</span>
          <span>{progress}%</span>
        </div>
        <div className="pixel-loader-screen">
          <p>$ {activeLine}</p>
          <p>$ STATUS: {progress < 100 ? 'IN PROGRESS' : 'COMPLETE'}</p>
          <p>$ PLEASE WAIT<span className="pixel-loader-cursor">_</span></p>
        </div>
        <div className="pixel-loader-bar-wrap">
          <div className="pixel-loader-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
