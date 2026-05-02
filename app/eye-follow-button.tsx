'use client';

import { useEffect, useRef } from 'react';

type Props = {
  href: string;
  label: string;
};

const MAX_OFFSET = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function EyeFollowButton({ href, label }: Props) {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const pupilLeftRef = useRef<HTMLSpanElement | null>(null);
  const pupilRightRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const leftPupil = pupilLeftRef.current;
    const rightPupil = pupilRightRef.current;
    if (!button || !leftPupil || !rightPupil) return;

    const eyes = Array.from(button.querySelectorAll('.eye-follow-button-eye')) as HTMLSpanElement[];
    if (!eyes.length) return;

    const movePupil = (clientX: number, clientY: number) => {
      eyes.forEach((eye, idx) => {
        const pupil = idx === 0 ? leftPupil : rightPupil;
        const rect = eye.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const distance = Math.hypot(dx, dy) || 1;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        const offsetX = clamp(normalizedX * Math.min(MAX_OFFSET, distance / 7), -MAX_OFFSET, MAX_OFFSET);
        const offsetY = clamp(normalizedY * Math.min(MAX_OFFSET, distance / 7), -MAX_OFFSET, MAX_OFFSET);
        pupil.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });
    };

    const onPointerMove = (event: PointerEvent) => movePupil(event.clientX, event.clientY);
    const onLeave = () => {
      leftPupil.style.transform = 'translate3d(0, 0, 0)';
      rightPupil.style.transform = 'translate3d(0, 0, 0)';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    button.addEventListener('pointerleave', onLeave);
    button.addEventListener('blur', onLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      button.removeEventListener('pointerleave', onLeave);
      button.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <a ref={buttonRef} className="eye-follow-button" href={href}>
      <span className="eye-follow-button-label">{label}</span>
      <span className="eye-follow-button-eyes" aria-hidden="true">
        <span className="eye-follow-button-eye">
          <span ref={pupilLeftRef} className="eye-follow-button-pupil" />
        </span>
        <span className="eye-follow-button-eye">
          <span ref={pupilRightRef} className="eye-follow-button-pupil" />
        </span>
      </span>
    </a>
  );
}
