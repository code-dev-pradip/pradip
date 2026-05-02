'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Project } from './portfolio-data';

type ProjectCardLayout = {
  top: number;
  left: number;
  width: number;
  rotate: number;
};

const CARD_LAYOUT: ProjectCardLayout[] = [
  { top: 4, left: 7, width: 260, rotate: -7 },
  { top: 9, left: 35, width: 290, rotate: 4 },
  { top: 5, left: 69, width: 250, rotate: 7 },
  { top: 44, left: 8, width: 280, rotate: -4 },
  { top: 49, left: 39, width: 300, rotate: -2 },
  { top: 47, left: 71, width: 270, rotate: 5 }
];

const STACK_LAYOUT: ProjectCardLayout[] = [
  { top: 27, left: 36, width: 260, rotate: -5 },
  { top: 27, left: 36, width: 290, rotate: 3 },
  { top: 27, left: 36, width: 250, rotate: 6 },
  { top: 27, left: 36, width: 280, rotate: -3 },
  { top: 27, left: 36, width: 300, rotate: -1 },
  { top: 27, left: 36, width: 270, rotate: 4 }
];

export default function DraggableProjectBoard({ projects }: { projects: Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dropStarted, setDropStarted] = useState(false);
  const [dropSettled, setDropSettled] = useState(false);
  const [boardSize, setBoardSize] = useState({ width: 1120, height: 660 });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const dropStartedRef = useRef(false);

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
      }, 1220);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startSpreadAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(board);

    return () => {
      observer.disconnect();
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, []);

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
    <div className={`project-board${dropStarted ? ' is-drop-started' : ''}${dropSettled ? ' is-drop-settled' : ''}`} ref={boardRef}>
      <div className="project-board-canvas">
        {projects.map((project, index) => {
          const finalLayout = CARD_LAYOUT[index % CARD_LAYOUT.length];
          const stackLayout = STACK_LAYOUT[index % STACK_LAYOUT.length];
          const isHovered = hoveredIndex === index;
          const liftY = isHovered ? -6 : 0;
          const scale = isHovered ? 1.045 : 1;
          const finalX = (finalLayout.left / 100) * boardSize.width;
          const finalY = (finalLayout.top / 100) * boardSize.height;
          const stackX = (stackLayout.left / 100) * boardSize.width;
          const stackY = (stackLayout.top / 100) * boardSize.height;
          const spreadX = dropStarted ? 0 : stackX - finalX;
          const spreadY = dropStarted ? 0 : stackY - finalY;
          const rotate = dropStarted ? finalLayout.rotate : stackLayout.rotate;

          return (
            <article
              key={project.name}
              className={`draggable-project-card${isHovered ? ' is-hovered' : ''}${dropStarted ? ' is-revealed' : ' is-entering'}`}
              style={{
                top: `${finalLayout.top}%`,
                left: `${finalLayout.left}%`,
                width: `${finalLayout.width}px`,
                zIndex: isHovered ? 120 : index + 1,
                opacity: dropStarted ? 1 : 0.96,
                transform: `translate3d(${spreadX}px, ${spreadY + liftY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                transition: 'transform 680ms cubic-bezier(0.22, 0.9, 0.22, 1), opacity 400ms ease',
                transitionDelay: dropStarted ? `${index * 72}ms` : '0ms',
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
              <p className="project-hover-pill">{project.name}</p>
              <a href={project.link} tabIndex={-1} aria-hidden="true">
                <Image
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={520}
                  sizes="(max-width: 920px) 88vw, 300px"
                  draggable={false}
                />
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
