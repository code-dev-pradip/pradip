'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Project } from './portfolio-data';

const CARD_WIDTH = 260;
const CARD_GAP = 40;
const STACK_TOP_PERCENT = 27;
const DESKTOP_TOP: number[] = [6, 10, 6, 45, 50, 48];
const DESKTOP_ROTATE: number[] = [-7, 4, 7, -4, -2, 5];

export default function DraggableProjectBoard({
  projects,
  visibilityTargetId
}: {
  projects: Project[];
  visibilityTargetId?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dropStarted, setDropStarted] = useState(false);
  const [dropSettled, setDropSettled] = useState(false);
  const [boardSize, setBoardSize] = useState({ width: 1120, height: 660 });

  const boardRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const dropStartedRef = useRef(false);
  const isMobile = boardSize.width <= 920;

  useEffect(() => {
    setHoveredIndex(null);
    setDropStarted(false);
    setDropSettled(false);
    dropStartedRef.current = false;

    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, [projects]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startSpreadAnimation = () => {
      if (dropStartedRef.current) return;
      dropStartedRef.current = true;
      setDropStarted(true);

      if (prefersReducedMotion) {
        setDropSettled(true);
        return;
      }

      settleTimerRef.current = window.setTimeout(() => {
        setDropSettled(true);
      }, 960);
    };

    const visibilityTarget =
      (visibilityTargetId ? document.getElementById(visibilityTargetId) : null) ??
      board.closest('.node-projects') ??
      board;

    const rootScroller = board.closest('.canvas-viewport') as HTMLElement | null;
    const canUseInnerScroller = Boolean(
      rootScroller &&
        getComputedStyle(rootScroller).overflowY !== 'visible' &&
        rootScroller.scrollHeight > rootScroller.clientHeight + 2
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (entry.intersectionRatio < 0.5) return;
        startSpreadAnimation();
        observer.disconnect();
      },
      {
        root: canUseInnerScroller ? rootScroller : null,
        threshold: [0.25, 0.5, 0.75]
      }
    );

    observer.observe(visibilityTarget);

    return () => {
      observer.disconnect();
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [visibilityTargetId]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const updateSize = () => {
      const rect = board.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setBoardSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(board);

    return () => observer.disconnect();
  }, []);

  const openProject = (index: number) => {
    const link = projects[index]?.link;
    if (!link) return;
    window.location.assign(link);
  };

  const onCardKeyDown = (index: number, event: KeyboardEvent<HTMLElement>) => {
    if (!dropSettled) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openProject(index);
  };

  return (
    <div
      className={`project-board${dropStarted ? ' is-drop-started' : ''}${dropSettled ? ' is-drop-settled' : ''}`}
      ref={boardRef}
    >
      <div className="project-board-canvas">
        {projects.map((project, index) => {
          const column = index % 3;
          const clusterWidth = CARD_WIDTH * 3 + CARD_GAP * 2;
          const startX = Math.max((boardSize.width - clusterWidth) / 2, 0);
          const finalLeftPx = startX + column * (CARD_WIDTH + CARD_GAP);
          const finalTopPercent = DESKTOP_TOP[index % DESKTOP_TOP.length];
          const finalRotate = DESKTOP_ROTATE[index % DESKTOP_ROTATE.length];
          const stackLeftPx = startX + (clusterWidth - CARD_WIDTH) / 2;
          const stackRotate = index % 2 === 0 ? -4 : 4;
          const isHovered = hoveredIndex === index;
          const liftY = isHovered ? -14 : 0;
          const scale = isHovered ? 1.065 : 1;
          const finalX = finalLeftPx;
          const finalY = (finalTopPercent / 100) * boardSize.height;
          const stackX = stackLeftPx;
          const stackY = (STACK_TOP_PERCENT / 100) * boardSize.height;
          const spreadX = dropStarted ? 0 : stackX - finalX;
          const spreadY = dropStarted ? 0 : stackY - finalY;
          const rotate = dropStarted ? finalRotate : stackRotate;

          if (isMobile) {
            return (
              <article
                key={project.name}
                className={`draggable-project-card mobile-stack${isHovered ? ' is-hovered' : ''}`}
                tabIndex={0}
                role="link"
                aria-label={`Open ${project.name}`}
                onClick={() => openProject(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
                onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
                onKeyDown={(event) => onCardKeyDown(index, event)}
              >
                <p className="project-hover-pill">Visit Project · {project.name}</p>
                <a href={project.link} tabIndex={-1} aria-hidden="true">
                  <div className="draggable-project-image">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      priority
                      loading="eager"
                      sizes="92vw"
                      style={{ objectFit: 'cover', objectPosition: 'top center' }}
                      draggable={false}
                    />
                  </div>
                  <div className="draggable-project-meta">
                    <h3>{project.name}</h3>
                    <p>{project.tech.slice(0, 2).join(' · ')}</p>
                  </div>
                </a>
              </article>
            );
          }

          return (
            <article
              key={project.name}
              className={`draggable-project-card${isHovered ? ' is-hovered' : ''}${dropStarted ? ' is-revealed' : ' is-entering'}`}
              style={{
                top: `${finalTopPercent}%`,
                left: `${finalLeftPx}px`,
                width: `${CARD_WIDTH}px`,
                zIndex: isHovered ? 20 : index + 1,
                opacity: dropStarted ? 1 : 0.96,
                transform: `translate3d(${spreadX}px, ${spreadY + liftY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                transition: 'transform 620ms cubic-bezier(0.22, 0.9, 0.22, 1), opacity 360ms ease',
                transitionDelay: dropStarted && !dropSettled ? `${index * 58}ms` : '0ms',
                pointerEvents: dropSettled ? 'auto' : 'none'
              }}
              tabIndex={dropSettled ? 0 : -1}
              role="link"
              aria-label={`Open ${project.name}`}
              aria-hidden={!dropStarted}
              onClick={() => {
                if (!dropSettled) return;
                openProject(index);
              }}
              onMouseEnter={() => {
                if (!dropSettled) return;
                setHoveredIndex(index);
              }}
              onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
              onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
              onKeyDown={(event) => onCardKeyDown(index, event)}
            >
              <p className="project-hover-pill">Visit Project · {project.name}</p>
              <a href={project.link} tabIndex={-1} aria-hidden="true">
                <div className="draggable-project-image">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    priority={index < 4}
                    loading="eager"
                    sizes="(max-width: 920px) 88vw, 300px"
                    style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    draggable={false}
                  />
                </div>
                <div className="draggable-project-meta">
                  <h3>{project.name}</h3>
                  <p>{project.tech.slice(0, 2).join(' · ')}</p>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
