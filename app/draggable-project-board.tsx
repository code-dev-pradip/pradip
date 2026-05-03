'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import type { Project } from './portfolio-data';

type ProjectCardState = {
  project: Project;
  dx: number;
  dy: number;
  z: number;
};

type DragState = {
  index: number;
  startX: number;
  startY: number;
  startDx: number;
  startDy: number;
  moved: boolean;
};

const CARD_WIDTH = 260;
const CARD_GAP = 40;
const STACK_TOP_PERCENT = 27;
const DESKTOP_TOP: number[] = [6, 10, 6, 45, 50, 48];
const DESKTOP_ROTATE: number[] = [-7, 4, 7, -4, -2, 5];

const CLICK_DRAG_THRESHOLD = 10;

function getTouchPoint(event: TouchEvent) {
  const touch = event.touches[0] ?? event.changedTouches[0];
  if (!touch) return null;
  return { x: touch.clientX, y: touch.clientY };
}

export default function DraggableProjectBoard({
  projects,
  visibilityTargetId
}: {
  projects: Project[];
  visibilityTargetId?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropStarted, setDropStarted] = useState(false);
  const [dropSettled, setDropSettled] = useState(false);
  const [boardSize, setBoardSize] = useState({ width: 1120, height: 660 });
  const [cards, setCards] = useState<ProjectCardState[]>(() =>
    projects.map((project, index) => ({
      project,
      dx: 0,
      dy: 0,
      z: index + 1
    }))
  );

  const boardRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef(cards);
  const maxZRef = useRef(cards.length + 1);
  const dragRef = useRef<DragState | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const dropStartedRef = useRef(false);
  const isMobile = boardSize.width <= 920;

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    setCards(
      projects.map((project, index) => ({
        project,
        dx: 0,
        dy: 0,
        z: index + 1
      }))
    );
    maxZRef.current = projects.length + 1;
    setHoveredIndex(null);
    setDraggingIndex(null);
    setDropStarted(false);
    setDropSettled(false);
    dropStartedRef.current = false;
    dragRef.current = null;

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
        if (entry.isIntersecting) {
          startSpreadAnimation();
          observer.disconnect();
        }
      },
      {
        root: canUseInnerScroller ? rootScroller : null,
        threshold: 0.5
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

  const bringToFront = (index: number) => {
    const nextZ = maxZRef.current++;
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, z: nextZ } : card)));
  };

  const openProject = useCallback((index: number) => {
    const link = cardsRef.current[index]?.project.link;
    if (!link) return;
    window.location.assign(link);
  }, []);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag) return;

    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;
    const movedDistance = Math.hypot(deltaX, deltaY);

    if (movedDistance > CLICK_DRAG_THRESHOLD && !drag.moved) {
      dragRef.current = { ...drag, moved: true };
    }

    setCards((prev) =>
      prev.map((card, i) =>
        i === drag.index
          ? {
              ...card,
              dx: drag.startDx + deltaX,
              dy: drag.startDy + deltaY
            }
          : card
      )
    );
  }, []);

  const finishDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;

    const shouldOpen = !drag.moved;
    const finishedIndex = drag.index;

    dragRef.current = null;
    setDraggingIndex(null);

    if (shouldOpen) {
      openProject(finishedIndex);
    }
  }, [openProject]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      handleDragMove(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const point = getTouchPoint(event);
      if (!point) return;
      event.preventDefault();
      handleDragMove(point.x, point.y);
    };

    const onMouseUp = () => finishDrag();
    const onTouchEnd = () => finishDrag();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [finishDrag, handleDragMove]);

  const handleMouseDown = (index: number, event: ReactMouseEvent<HTMLElement>) => {
    if (isMobile) return;
    if (event.button !== 0) return;
    if (!dropSettled) return;

    const card = cardsRef.current[index];
    if (!card) return;

    bringToFront(index);
    setDraggingIndex(index);
    setHoveredIndex(index);

    dragRef.current = {
      index,
      startX: event.clientX,
      startY: event.clientY,
      startDx: card.dx,
      startDy: card.dy,
      moved: false
    };

    event.preventDefault();
  };

  const handleTouchStart = (index: number, event: ReactTouchEvent<HTMLElement>) => {
    if (isMobile) return;
    if (!dropSettled) return;

    const touch = event.touches[0];
    if (!touch) return;

    const card = cardsRef.current[index];
    if (!card) return;

    bringToFront(index);
    setDraggingIndex(index);
    setHoveredIndex(index);

    dragRef.current = {
      index,
      startX: touch.clientX,
      startY: touch.clientY,
      startDx: card.dx,
      startDy: card.dy,
      moved: false
    };

    event.preventDefault();
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
        {cards.map((card, index) => {
          const column = index % 3;
          const clusterWidth = CARD_WIDTH * 3 + CARD_GAP * 2;
          const startX = Math.max((boardSize.width - clusterWidth) / 2, 0);
          const finalLeftPx = startX + column * (CARD_WIDTH + CARD_GAP);
          const finalTopPercent = DESKTOP_TOP[index % DESKTOP_TOP.length];
          const finalRotate = DESKTOP_ROTATE[index % DESKTOP_ROTATE.length];
          const stackLeftPx = startX + (clusterWidth - CARD_WIDTH) / 2;
          const stackRotate = index % 2 === 0 ? -4 : 4;
          const isHovered = hoveredIndex === index;
          const isDragging = draggingIndex === index;
          const liftY = isDragging ? -20 : isHovered ? -14 : 0;
          const scale = isDragging ? 1.08 : isHovered ? 1.065 : 1;
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
                key={card.project.name}
                className={`draggable-project-card mobile-stack${isHovered ? ' is-hovered' : ''}`}
                tabIndex={0}
                role="link"
                aria-label={`Open ${card.project.name}`}
                onClick={() => openProject(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
                onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
                onKeyDown={(event) => onCardKeyDown(index, event)}
              >
                <p className="project-hover-pill">Visit Project · {card.project.name}</p>
                <a href={card.project.link} tabIndex={-1} aria-hidden="true">
                <div className="draggable-project-image">
                  <Image
                    src={card.project.image}
                    alt={card.project.name}
                    fill
                    priority
                    loading="eager"
                    sizes="92vw"
                    style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    draggable={false}
                  />
                </div>
                  <div className="draggable-project-meta">
                    <h3>{card.project.name}</h3>
                    <p>{card.project.tech.slice(0, 2).join(' · ')}</p>
                  </div>
                </a>
              </article>
            );
          }

          return (
            <article
              key={card.project.name}
              className={`draggable-project-card${isHovered ? ' is-hovered' : ''}${isDragging ? ' is-dragging' : ''}${
                dropStarted ? ' is-revealed' : ' is-entering'
              }`}
              style={{
                top: `${finalTopPercent}%`,
                left: `${finalLeftPx}px`,
                width: `${CARD_WIDTH}px`,
                zIndex: card.z,
                opacity: dropStarted ? 1 : 0.96,
                transform: `translate3d(${spreadX + card.dx}px, ${spreadY + card.dy + liftY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 680ms cubic-bezier(0.22, 0.9, 0.22, 1), opacity 400ms ease',
                transitionDelay: dropStarted && !dropSettled ? `${index * 72}ms` : '0ms',
                pointerEvents: dropSettled ? 'auto' : 'none'
              }}
              tabIndex={dropSettled ? 0 : -1}
              role="link"
              aria-label={`Open ${card.project.name}`}
              aria-grabbed={isDragging}
              aria-hidden={!dropStarted}
              onMouseEnter={() => {
                if (!dropSettled) return;
                setHoveredIndex(index);
                bringToFront(index);
              }}
              onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
              onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
              onKeyDown={(event) => onCardKeyDown(index, event)}
              onMouseDown={(event) => handleMouseDown(index, event)}
              onTouchStart={(event) => handleTouchStart(index, event)}
              onDragStart={(event) => event.preventDefault()}
            >
              <p className="project-hover-pill">Visit Project · {card.project.name}</p>
              <a href={card.project.link} tabIndex={-1} aria-hidden="true">
                <div className="draggable-project-image">
                  <Image
                    src={card.project.image}
                    alt={card.project.name}
                    fill
                    priority={index < 4}
                    loading="eager"
                    sizes="(max-width: 920px) 88vw, 300px"
                    style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    draggable={false}
                  />
                </div>
                <div className="draggable-project-meta">
                  <h3>{card.project.name}</h3>
                  <p>{card.project.tech.slice(0, 2).join(' · ')}</p>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
