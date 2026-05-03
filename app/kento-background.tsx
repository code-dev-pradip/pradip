'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

type Point = { x: number; y: number };

const TRAIL_COUNT = 10;

export default function KentoBackground() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const trail = useMemo<Point[]>(() => Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 })), []);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!media.matches) return;

    const state = {
      tx: window.innerWidth * 0.5,
      ty: window.innerHeight * 0.5,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      visible: false,
      interactive: false
    };

    let rafId = 0;

    const setVisible = (visible: boolean) => {
      if (state.visible === visible) return;
      state.visible = visible;
      cursorRef.current?.classList.toggle('is-visible', visible);
      for (const el of trailRefs.current) {
        el?.classList.toggle('is-visible', visible);
      }
    };

    const setInteractive = (interactive: boolean) => {
      if (state.interactive === interactive) return;
      state.interactive = interactive;
      cursorRef.current?.classList.toggle('is-link', interactive);
    };

    const onPointerMove = (event: PointerEvent) => {
      state.tx = event.clientX;
      state.ty = event.clientY;
      const target = event.target as Element | null;
      const interactive = Boolean(
        target?.closest?.('a, button, [role="button"], input, textarea, select, summary, label')
      );
      setInteractive(interactive);
      setVisible(true);
    };

    const onPointerLeave = () => {
      setVisible(false);
      setInteractive(false);
    };

    const tick = () => {
      state.x += (state.tx - state.x) * 0.36;
      state.y += (state.ty - state.y) * 0.36;

      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.transform = `translate3d(${state.x - 9}px, ${state.y - 9}px, 0)`;
      }

      for (let i = 0; i < trail.length; i += 1) {
        const prev = i === 0 ? { x: state.x, y: state.y } : trail[i - 1];
        const ease = 0.34 - i * 0.02;
        trail[i].x += (prev.x - trail[i].x) * Math.max(0.12, ease);
        trail[i].y += (prev.y - trail[i].y) * Math.max(0.12, ease);

        const node = trailRefs.current[i];
        if (!node) continue;
        const size = Math.max(4, 14 - i);
        node.style.transform = `translate3d(${trail[i].x - size / 2}px, ${trail[i].y - size / 2}px, 0)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, [trail]);

  return (
    <>
      <div className="kento-bg" aria-hidden="true">
        <div className="kento-bg-layer kento-bg-layer-a" />
        <div className="kento-bg-layer kento-bg-layer-b" />
        <div className="kento-bg-noise" />
      </div>

      <div className="kento-cursor" ref={cursorRef} aria-hidden="true" />
      <div className="kento-trail" aria-hidden="true">
        {Array.from({ length: TRAIL_COUNT }, (_, i) => (
          <span
            key={i}
            ref={(node) => {
              trailRefs.current[i] = node;
            }}
            style={{ ['--trail-i' as string]: i } as CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
