'use client';

import { useEffect, useRef } from 'react';

type ShapeConfig = {
  key: 'interaction' | 'uiux' | 'visual';
  label: string;
  angleDeg: number;
  startXPct: number;
  startYPct: number;
  startScale: number;
  finalScale: number;
  spinScale: number;
  sizeFactor: number;
};

const SHAPES: ShapeConfig[] = [
  {
    key: 'interaction',
    label: 'Interaction\ndesign',
    angleDeg: -132,
    startXPct: 30,
    startYPct: 22,
    startScale: 1.12,
    finalScale: 0.58,
    spinScale: 0.82,
    sizeFactor: 1.04
  },
  {
    key: 'uiux',
    label: 'UI/UX',
    angleDeg: -14,
    startXPct: 77,
    startYPct: 24,
    startScale: 1.06,
    finalScale: 0.58,
    spinScale: 0.76,
    sizeFactor: 1.02
  },
  {
    key: 'visual',
    label: 'Visual\ndesign',
    angleDeg: 96,
    startXPct: 52,
    startYPct: 84,
    startScale: 1.1,
    finalScale: 0.58,
    spinScale: 0.66,
    sizeFactor: 1.02
  }
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export default function HeroOrbit() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRingRef = useRef<HTMLDivElement | null>(null);
  const introContentRef = useRef<HTMLDivElement | null>(null);
  const ornamentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const shapeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;

    const update = () => {
      const sectionRect = section.getBoundingClientRect();
      const scrollSpan = Math.max(section.offsetHeight - window.innerHeight, 1);
      const raw = clamp(-sectionRect.top / scrollSpan, 0, 1);
      const t = smoothstep(raw);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const centerX = vw * 0.5;
      const centerY = vh * 0.61;
      const ringRadius = clamp(Math.min(vh * 0.32, vw * 0.24), 140, 300);
      const ringSize = ringRadius * 2;

      const baseSize = clamp(vw * 0.33, 250, 620);
      const spinAngle = t * Math.PI * 0.9;
      const spinDeg = (spinAngle * 180) / Math.PI;
      const introProgress = smoothstep(clamp(raw / 0.58, 0, 1));
      const introOpacity = clamp((0.58 - raw) / 0.26, 0, 1);
      const ringOpacity = clamp((raw - 0.36) / 0.24, 0, 1);
      const labelsOpacity = clamp((raw - 0.44) / 0.2, 0, 1);

      if (introContentRef.current) {
        introContentRef.current.style.opacity = `${introOpacity}`;
        introContentRef.current.style.filter = `blur(${lerp(0, 18, 1 - introOpacity)}px)`;
        introContentRef.current.style.transform = `translate3d(0, ${lerp(0, -88, introProgress)}px, 0)`;
      }

      const ornamentLeft = ornamentRefs.current.left;
      const ornamentTop = ornamentRefs.current.top;
      const ornamentRight = ornamentRefs.current.right;

      if (ornamentLeft) {
        ornamentLeft.style.opacity = `${clamp(1 - raw * 1.05, 0, 1)}`;
        ornamentLeft.style.transform = `translate3d(${lerp(0, -54, introProgress)}px, ${lerp(0, 34, introProgress)}px, 0) rotate(${lerp(
          0,
          -28,
          introProgress
        )}deg)`;
      }

      if (ornamentTop) {
        ornamentTop.style.opacity = `${clamp(0.94 - raw * 0.95, 0, 0.94)}`;
        ornamentTop.style.transform = `translate3d(${lerp(-50, -30, introProgress)}%, ${lerp(
          0,
          -44,
          introProgress
        )}px, 0) rotate(${lerp(0, 60, introProgress)}deg)`;
      }

      if (ornamentRight) {
        ornamentRight.style.opacity = `${clamp(0.96 - raw * 0.9, 0, 0.96)}`;
        ornamentRight.style.transform = `translate3d(${lerp(0, 42, introProgress)}px, ${lerp(
          0,
          28,
          introProgress
        )}px, 0) rotate(${lerp(0, 38, introProgress)}deg)`;
      }

      if (ringRef.current) {
        ringRef.current.style.width = `${ringSize}px`;
        ringRef.current.style.height = `${ringSize}px`;
        ringRef.current.style.left = `${centerX}px`;
        ringRef.current.style.top = `${centerY}px`;
        ringRef.current.style.opacity = `${ringOpacity}`;
      }

      if (labelRingRef.current) {
        labelRingRef.current.style.opacity = `${labelsOpacity}`;
      }

      for (const shape of SHAPES) {
        const el = shapeRefs.current[shape.key];
        if (!el) continue;

        const label = labelRefs.current[shape.key];
        const baseAngle = (shape.angleDeg * Math.PI) / 180;
        const orbitAngle = baseAngle + spinAngle;

        const endX = centerX + Math.cos(orbitAngle) * ringRadius;
        const endY = centerY + Math.sin(orbitAngle) * ringRadius;

        const startX = (shape.startXPct / 100) * vw;
        const startY = (shape.startYPct / 100) * vh;

        const x = lerp(startX, endX, t);
        const y = lerp(startY, endY, t);

        const currentScale = lerp(shape.startScale, shape.finalScale, t);
        const size = baseSize * shape.sizeFactor * currentScale;
        const rot = spinDeg * shape.spinScale;

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) rotate(${rot}deg)`;

        if (label) {
          label.style.transform = `translate(-50%, -50%) rotate(${-rot}deg)`;
          label.style.opacity = `${labelsOpacity}`;
        }
      }
    };

    const requestTick = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const renderLabel = (label: string) => {
    const lines = label.split('\n');
    return lines.map((line, index) => (
      <span key={`${line}-${index}`}>
        {line}
        {index < lines.length - 1 ? <br /> : null}
      </span>
    ));
  };

  return (
    <section className="hero-marimba" ref={sectionRef} id="home">
      <div className="hero-marimba-stage">
        <div className="hero-marimba-grid" aria-hidden="true" />

        <div
          className="hero-marimba-ornament hero-marimba-ornament-left"
          ref={(node) => {
            ornamentRefs.current.left = node;
          }}
          aria-hidden="true"
        />
        <div
          className="hero-marimba-ornament hero-marimba-ornament-top"
          ref={(node) => {
            ornamentRefs.current.top = node;
          }}
          aria-hidden="true"
        />
        <div
          className="hero-marimba-ornament hero-marimba-ornament-right"
          ref={(node) => {
            ornamentRefs.current.right = node;
          }}
          aria-hidden="true"
        />

        <div className="hero-marimba-content" ref={introContentRef}>
          <p className="hero-marimba-pill">Web design &amp; development</p>
          <h1 className="hero-marimba-title">
            I <span className="hero-marimba-inline hero-marimba-inline-self" aria-hidden="true" />
            create living, breathing
            <br />
            websites for brands <span className="hero-marimba-inline hero-marimba-inline-work" aria-hidden="true" />
            that want
            <br />
            to be felt, not just seen.
          </h1>
        </div>

        <div
          className="hero-orbit-shape hero-orbit-interaction"
          ref={(node) => {
            shapeRefs.current.interaction = node;
          }}
        >
          <span
            className="hero-orbit-label"
            ref={(node) => {
              labelRefs.current.interaction = node;
            }}
          >
            {renderLabel(SHAPES[0].label)}
          </span>
        </div>

        <div
          className="hero-orbit-shape hero-orbit-uiux"
          ref={(node) => {
            shapeRefs.current.uiux = node;
          }}
        >
          <span
            className="hero-orbit-label"
            ref={(node) => {
              labelRefs.current.uiux = node;
            }}
          >
            {SHAPES[1].label}
          </span>
        </div>

        <div
          className="hero-orbit-shape hero-orbit-visual"
          ref={(node) => {
            shapeRefs.current.visual = node;
          }}
        >
          <span
            className="hero-orbit-label"
            ref={(node) => {
              labelRefs.current.visual = node;
            }}
          >
            {renderLabel(SHAPES[2].label)}
          </span>
        </div>

        <div className="hero-marimba-ring" ref={ringRef} aria-hidden="true">
          <div className="hero-marimba-ring-text" ref={labelRingRef}>
            My design
            <br />
            practice
          </div>
        </div>
      </div>
    </section>
  );
}
