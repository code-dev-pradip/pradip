'use client';

import { useEffect } from 'react';

export default function ButtonClickSound() {
  useEffect(() => {
    const clickSound = new Audio('/sounds/button-click.mp3');
    clickSound.preload = 'auto';
    clickSound.volume = 0.5;

    const hoverSound = new Audio('/sounds/button-hover.mp3');
    hoverSound.preload = 'auto';
    hoverSound.volume = 0.35;

    const interactiveSelector =
      'a[href], button, input[type="button"], input[type="submit"], [role="button"], .btn, [data-click-sound="true"]';

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-click-sound="false"]')) return;

      const clickable = target.closest(interactiveSelector) as HTMLElement | null;
      if (!clickable) return;
      if (clickable.hasAttribute('disabled') || clickable.getAttribute('aria-disabled') === 'true') return;

      const sound = clickSound.cloneNode() as HTMLAudioElement;
      sound.volume = clickSound.volume;
      void sound.play().catch(() => {});
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-hover-sound="false"]')) return;

      const hovered = target.closest(interactiveSelector) as HTMLElement | null;
      if (!hovered) return;
      if (hovered.hasAttribute('disabled') || hovered.getAttribute('aria-disabled') === 'true') return;

      const related = event.relatedTarget as HTMLElement | null;
      if (related && hovered.contains(related)) return;

      const sound = hoverSound.cloneNode() as HTMLAudioElement;
      sound.volume = hoverSound.volume;
      void sound.play().catch(() => {});
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerover', onPointerOver, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerover', onPointerOver, true);
    };
  }, []);

  return null;
}
