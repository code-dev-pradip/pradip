'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function RevealAnimations() {
  useEffect(() => {
    const chipLoopTimelines: gsap.core.Timeline[] = [];
    const chipLoopDelays: gsap.core.Tween[] = [];
    const activeChipPositions: Array<{ x: number; y: number } | null> = [];
    const navbar = document.querySelector<HTMLElement>('.floating-center-nav');
    const canvasViewport = document.querySelector<HTMLElement>('.canvas-viewport');
    const hero = document.querySelector<HTMLElement>('.node-hero');
    const aboutSection = document.querySelector<HTMLElement>('.node-about-free');
    const lowerCards = gsap.utils.toArray<HTMLElement>(
      '.node-cap-experience, .node-certs, .node-contact'
    );
    const aboutNote = document.querySelector<HTMLElement>('.about-free-note p');
    const aboutLines = gsap.utils.toArray<HTMLElement>('.about-free-lines p');
    const heroEyebrow = document.querySelector<HTMLElement>('.node-hero .canvas-eyebrow');
    const heroTitle = document.querySelector<HTMLElement>('.node-hero .canvas-title');
    const heroCopy = document.querySelector<HTMLElement>('.node-hero .canvas-copy');
    const heroButton = document.querySelector<HTMLElement>('.node-hero .eye-follow-button');
    const heroCloud = document.querySelector<HTMLElement>('.hero-tech-cloud');
    const heroMainNodes = gsap.utils.toArray<HTMLElement>('.hero-tech-orbit-main .hero-tech-node');
    const heroMainChips = gsap.utils.toArray<HTMLElement>('.hero-tech-orbit-main .hero-tech-chip');
    const visibleHeroChips = heroMainChips.slice(0, 6);
    const hiddenHeroChips = heroMainChips.slice(6);
    for (let i = 0; i < visibleHeroChips.length; i += 1) activeChipPositions.push(null);

    if (!navbar || !hero || !heroEyebrow || !heroTitle || !heroCopy || !heroButton) return;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevBodyTouchAction = bodyEl.style.touchAction;
    const prevViewportOverflowY = canvasViewport?.style.overflowY ?? '';
    const prevViewportTouchAction = canvasViewport?.style.touchAction ?? '';

    type SplitTextEntry = {
      el: HTMLElement;
      original: string;
      chars: HTMLElement[];
    };

    const splitTextEntries: SplitTextEntry[] = [];
    const splitElement = (el: HTMLElement | null) => {
      if (!el) return;
      const original = el.textContent?.trim() || '';
      if (!original) return;
      const chars: HTMLElement[] = [];
      el.textContent = '';
      el.setAttribute('aria-label', original);

      const words = original.split(' ');
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'split-word';
        for (const char of Array.from(word)) {
          const charSpan = document.createElement('span');
          charSpan.className = 'split-char';
          charSpan.textContent = char;
          chars.push(charSpan);
          wordSpan.appendChild(charSpan);
        }
        el.appendChild(wordSpan);
        if (wordIndex < words.length - 1) {
          const space = document.createElement('span');
          space.className = 'split-space';
          space.innerHTML = '&nbsp;';
          el.appendChild(space);
        }
      });

      splitTextEntries.push({ el, original, chars });
    };

    splitElement(heroTitle);
    splitElement(aboutNote);

    const heroSplit = splitTextEntries.find((entry) => entry.el === heroTitle);
    const heroSplitChars = heroSplit?.chars ?? [];
    const aboutNoteSplit = splitTextEntries.find((entry) => entry.el === aboutNote);
    const aboutNoteSplitChars = aboutNoteSplit?.chars ?? [];
    const aboutLineTargets = aboutLines.filter((target): target is HTMLElement => Boolean(target));

    gsap.set(navbar, { y: -54, autoAlpha: 0 });
    gsap.set([heroEyebrow, heroCopy, heroButton], { y: 26, autoAlpha: 0 });
    if (heroSplitChars.length > 0) {
      gsap.set(heroTitle, { autoAlpha: 1, y: 0 });
      gsap.set(heroSplitChars, { autoAlpha: 0, y: 38, filter: 'blur(8px)' });
    } else {
      gsap.set(heroTitle, { y: 26, autoAlpha: 0 });
    }
    if (aboutNoteSplitChars.length > 0 && aboutNote) {
      gsap.set(aboutNote, { autoAlpha: 1, y: 0 });
      gsap.set(aboutNoteSplitChars, { autoAlpha: 0, y: 30, filter: 'blur(7px)' });
    }
    gsap.set(aboutLineTargets, { y: 26, autoAlpha: 0 });
    if (lowerCards.length > 0) {
      gsap.set(lowerCards, { y: 38, autoAlpha: 0 });
    }
    gsap.set(heroMainChips, {
      autoAlpha: 0,
      filter: 'blur(6px)',
      y: 120,
      scale: 2.15
    });
    gsap.set(hiddenHeroChips, { autoAlpha: 0, display: 'none' });

    heroCloud?.classList.remove('is-orbiting');
    for (const node of heroMainNodes) {
      gsap.set(node, { '--orbit-radius-current': '0px', '--tech-angle-current': '0deg' });
    }

    let hasPlayed = false;
    let isScrollLocked = false;

    const lockScroll = () => {
      if (isScrollLocked) return;
      isScrollLocked = true;
      htmlEl.style.overflow = 'hidden';
      bodyEl.style.overflow = 'hidden';
      bodyEl.style.touchAction = 'none';
      if (canvasViewport) {
        canvasViewport.style.overflowY = 'hidden';
        canvasViewport.style.touchAction = 'none';
      }
    };

    const unlockScroll = () => {
      if (!isScrollLocked) return;
      isScrollLocked = false;
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      bodyEl.style.touchAction = prevBodyTouchAction;
      if (canvasViewport) {
        canvasViewport.style.overflowY = prevViewportOverflowY;
        canvasViewport.style.touchAction = prevViewportTouchAction;
      }
    };

    const getNoPopZones = () => {
      const zones: DOMRect[] = [];
      const targets = [navbar, heroEyebrow, heroTitle, heroCopy, heroButton];
      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const padX = 36;
        const padY = 24;
        zones.push(
          new DOMRect(rect.left - padX, rect.top - padY, rect.width + padX * 2, rect.height + padY * 2)
        );
      }
      return zones;
    };

    const getRandomHeroPoint = (chip: HTMLElement, chipIndex: number) => {
      const heroRect = hero.getBoundingClientRect();
      const isMobile = window.matchMedia('(max-width: 920px)').matches;
      const zones = getNoPopZones();
      const chipRect = chip.getBoundingClientRect();
      const chipRadius = Math.max(52, Math.max(chipRect.width, chipRect.height) * 0.54);
      const spacing = isMobile ? 170 : 300;
      const edgePad = isMobile ? 34 : 58;
      let best = { x: heroRect.width * 0.5, y: heroRect.height * 0.5 };
      let bestScore = -1;

      for (let i = 0; i < 80; i += 1) {
        const candidate = {
          x: gsap.utils.random(edgePad, heroRect.width - edgePad),
          y: gsap.utils.random(edgePad, heroRect.height - edgePad)
        };
        const viewportCandidate = {
          x: heroRect.left + candidate.x,
          y: heroRect.top + candidate.y
        };

        let blocked = false;
        for (const zone of zones) {
          if (
            viewportCandidate.x > zone.left - chipRadius &&
            viewportCandidate.x < zone.right + chipRadius &&
            viewportCandidate.y > zone.top - chipRadius &&
            viewportCandidate.y < zone.bottom + chipRadius
          ) {
            blocked = true;
            break;
          }
        }
        if (blocked) continue;

        let minDist = Number.POSITIVE_INFINITY;
        for (let p = 0; p < activeChipPositions.length; p += 1) {
          if (p === chipIndex) continue;
          const active = activeChipPositions[p];
          if (!active) continue;
          const dx = candidate.x - active.x;
          const dy = candidate.y - active.y;
          minDist = Math.min(minDist, Math.hypot(dx, dy));
        }

        const score = Number.isFinite(minDist) ? minDist : spacing + 120;
        if (score > bestScore) {
          best = candidate;
          bestScore = score;
        }
        if (score >= spacing) break;
      }

      return {
        x: best.x - heroRect.width * 0.5,
        y: best.y - heroRect.height * 0.5,
        absoluteX: heroRect.left + best.x,
        absoluteY: heroRect.top + best.y
      };
    };

    const spawnChipPopLoop = (chip: HTMLElement, delay: number, chipIndex: number) => {
      const run = () => {
        const point = getRandomHeroPoint(chip, chipIndex);
        activeChipPositions[chipIndex] = { x: point.absoluteX, y: point.absoluteY };

        gsap.set(chip, {
          x: point.x,
          y: point.y,
          scale: 0.78,
          autoAlpha: 0,
          filter: 'blur(5px)'
        });

        const popTl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            activeChipPositions[chipIndex] = null;
            chipLoopDelays.push(gsap.delayedCall(gsap.utils.random(1.2, 2.2), run));
          }
        });

        popTl
          .to(chip, {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out'
          })
          .to(chip, {
            autoAlpha: 0,
            scale: 0.84,
            filter: 'blur(3px)',
            duration: 0.9,
            delay: gsap.utils.random(1.6, 2.6),
            ease: 'power2.in'
          });

        chipLoopTimelines.push(popTl);
      };

      chipLoopDelays.push(gsap.delayedCall(delay, run));
    };

    const playReveal = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      lockScroll();

      const isMobile = window.matchMedia('(max-width: 920px)').matches;
      const stackFontLarge = isMobile ? '0.92rem' : '1.08rem';
      const stackFontSmall = isMobile ? '0.63rem' : '0.72rem';
      const stackGap = isMobile ? 0.42 : 0.46;

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      for (let i = 0; i < visibleHeroChips.length; i += 1) {
        const currentChip = visibleHeroChips[i];
        const previousChip = i > 0 ? visibleHeroChips[i - 1] : null;

        timeline.to(
          currentChip,
          {
            autoAlpha: 1,
            y: 0,
            scale: 2.15,
            fontSize: stackFontLarge,
            filter: 'blur(0px)',
            duration: 0.56,
            ease: 'power2.out'
          },
          i === 0 ? '+=0' : `+=${stackGap}`
        );

        if (previousChip) {
          timeline.to(
            previousChip,
            {
              scale: 1,
              fontSize: stackFontSmall,
              autoAlpha: 0,
              filter: 'blur(3px)',
              duration: 0.62,
              ease: 'power2.inOut'
            },
            '<'
          );
        }
      }

      timeline.to(
        visibleHeroChips[visibleHeroChips.length - 1],
        {
          scale: 1,
          fontSize: stackFontSmall,
          duration: 0.6,
          ease: 'power2.inOut'
        },
        '+=0.2'
      );

      timeline.to(
        visibleHeroChips[visibleHeroChips.length - 1],
        {
          autoAlpha: 0,
          filter: 'blur(3px)',
          duration: 0.52,
          ease: 'power2.inOut'
        },
        '+=0.02'
      );

      timeline.to(navbar, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        clearProps: 'transform,opacity,visibility'
      });

      timeline.to(heroEyebrow, {
        y: 0,
        autoAlpha: 1,
        duration: 0.56,
        clearProps: 'transform,opacity,visibility'
      }, '-=0.24');

      if (heroSplitChars.length > 0) {
        timeline.to(
          heroSplitChars,
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.018,
            ease: 'power3.out'
          },
          '-=0.22'
        );
      } else {
        timeline.to(
          heroTitle,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            clearProps: 'transform,opacity,visibility'
          },
          '-=0.22'
        );
      }

      timeline.to(
        [heroCopy, heroButton],
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.66,
          stagger: 0.16,
          clearProps: 'transform,opacity,visibility'
        },
        '-=0.14'
      );

      timeline.add(() => {
        unlockScroll();
      }, '+=0');

      timeline.add(() => {
        heroCloud?.classList.remove('is-orbiting');
        for (const node of heroMainNodes) {
          gsap.set(node, { '--orbit-radius-current': '0px', '--tech-angle-current': '0deg' });
        }
        visibleHeroChips.forEach((chip, index) => {
          spawnChipPopLoop(chip, index * 0.36, index);
        });
      }, '-=0.16');

      timeline.set(visibleHeroChips, { clearProps: 'fontSize' });
    };

    let aboutAnimated = false;
    const playAboutTextReveal = () => {
      if (aboutAnimated) return;
      aboutAnimated = true;
      const aboutTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (aboutNoteSplitChars.length > 0) {
        aboutTl.to(aboutNoteSplitChars, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.48,
          stagger: 0.012
        });
      }

      if (aboutLineTargets.length > 0) {
        aboutTl.to(
          aboutLineTargets,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.66,
            stagger: 0.16,
            clearProps: 'transform,opacity,visibility'
          },
          aboutNoteSplitChars.length > 0 ? '<+0.18' : '+=0'
        );
      }
    };

    let aboutObserver: IntersectionObserver | null = null;
    if (aboutSection && (aboutNoteSplitChars.length > 0 || aboutLineTargets.length > 0)) {
      aboutObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
              playAboutTextReveal();
              aboutObserver?.disconnect();
              aboutObserver = null;
              break;
            }
          }
        },
        { root: canvasViewport ?? null, threshold: [0.2, 0.35] }
      );
      aboutObserver.observe(aboutSection);
    }

    const revealedLowerCards = new WeakSet<HTMLElement>();
    let lowerCardsObserver: IntersectionObserver | null = null;
    if (lowerCards.length > 0) {
      lowerCardsObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.2) continue;
            const card = entry.target as HTMLElement;
            if (revealedLowerCards.has(card)) continue;
            revealedLowerCards.add(card);
            gsap.to(card, {
              y: 0,
              autoAlpha: 1,
              duration: 0.72,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility'
            });
            lowerCardsObserver?.unobserve(card);
          }
        },
        { root: canvasViewport ?? null, threshold: [0.2, 0.35, 0.5] }
      );
      lowerCards.forEach((card) => lowerCardsObserver?.observe(card));
    }

    const rafId = window.requestAnimationFrame(playReveal);

    return () => {
      unlockScroll();
      aboutObserver?.disconnect();
      lowerCardsObserver?.disconnect();
      window.cancelAnimationFrame(rafId);
      chipLoopTimelines.forEach((timeline) => timeline.kill());
      chipLoopDelays.forEach((delay) => delay.kill());
      gsap.killTweensOf(visibleHeroChips);
      splitTextEntries.forEach((entry) => {
        entry.el.textContent = entry.original;
        entry.el.removeAttribute('aria-label');
      });
    };
  }, []);

  return null;
}
