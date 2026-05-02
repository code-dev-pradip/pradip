'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type Cell = { row: number; col: number };

type GridState = {
  rows: number;
  cols: number;
  cellSize: number;
  offsetX: number;
  offsetY: number;
  frameLeft: number;
  frameTop: number;
};

const BASE_CELL_SIZE = 44;
const MAX_CELLS = 1500;
const TRAIL_INTERVAL = 14;
const MAX_WAVE_DISTANCE = 2.6;
const ANIMATION_DELAY = 8;
const BASE_DURATION = 120;
const DURATION_STEP = 20;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeGrid(rect: DOMRect): GridState {
  let cellSize = BASE_CELL_SIZE;
  let cols = Math.ceil(rect.width / cellSize);
  let rows = Math.ceil(rect.height / cellSize);

  if (rows * cols > MAX_CELLS) {
    const ratio = Math.sqrt((rows * cols) / MAX_CELLS);
    cellSize = Math.ceil(BASE_CELL_SIZE * ratio);
    cols = Math.ceil(rect.width / cellSize);
    rows = Math.ceil(rect.height / cellSize);
  }

  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  return {
    rows,
    cols,
    cellSize,
    offsetX: Math.floor((rect.width - gridWidth) / 2),
    offsetY: Math.floor((rect.height - gridHeight) / 2),
    frameLeft: rect.left,
    frameTop: rect.top
  };
}

function toGridCell(clientX: number, clientY: number, grid: GridState): Cell | null {
  const localX = clientX - grid.frameLeft - grid.offsetX;
  const localY = clientY - grid.frameTop - grid.offsetY;

  if (localX < 0 || localY < 0) return null;

  const col = Math.floor(localX / grid.cellSize);
  const row = Math.floor(localY / grid.cellSize);

  if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return null;
  return { row, col };
}

function getIndex(row: number, col: number, cols: number) {
  return row * cols + col;
}

export default function RippleBackground() {
  const [grid, setGrid] = useState<GridState | null>(null);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<GridState | null>(null);
  const rafMoveRef = useRef(0);
  const lastTrailRef = useRef(0);
  const lastCellRef = useRef<Cell | null>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const waveFlipRef = useRef(false);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateGrid = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setGrid(computeGrid(rect));
    };

    updateGrid();

    const observer = new ResizeObserver(() => updateGrid());
    observer.observe(frame);
    window.addEventListener('resize', updateGrid);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateGrid);
    };
  }, []);

  const cells = useMemo(() => {
    if (!grid) return [];
    return Array.from({ length: grid.rows * grid.cols }, (_, idx) => idx);
  }, [grid]);

  useEffect(() => {
    if (!grid) return;
    // Clear stale refs whenever grid is recalculated.
    cellRefs.current = Array.from({ length: grid.rows * grid.cols }, () => null);
    lastCellRef.current = null;
    hoverIndexRef.current = null;
  }, [grid]);

  useEffect(() => {
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setHoveredCell = (cell: Cell | null) => {
      const currentGrid = gridRef.current;
      if (!currentGrid) return;

      const prevIndex = hoverIndexRef.current;
      if (prevIndex !== null) {
        const prevNode = cellRefs.current[prevIndex];
        prevNode?.classList.remove('is-hovered');
      }

      if (!cell) {
        hoverIndexRef.current = null;
        return;
      }

      const nextIndex = getIndex(cell.row, cell.col, currentGrid.cols);
      const nextNode = cellRefs.current[nextIndex];
      nextNode?.classList.add('is-hovered');
      hoverIndexRef.current = nextIndex;
    };

    const triggerWave = (origin: Cell) => {
      const currentGrid = gridRef.current;
      if (!currentGrid) return;

      waveFlipRef.current = !waveFlipRef.current;
      const animationName = waveFlipRef.current ? 'ripple-cell-wave-a' : 'ripple-cell-wave-b';
      const rowStart = Math.max(0, Math.floor(origin.row - MAX_WAVE_DISTANCE));
      const rowEnd = Math.min(currentGrid.rows - 1, Math.ceil(origin.row + MAX_WAVE_DISTANCE));
      const colStart = Math.max(0, Math.floor(origin.col - MAX_WAVE_DISTANCE));
      const colEnd = Math.min(currentGrid.cols - 1, Math.ceil(origin.col + MAX_WAVE_DISTANCE));

      for (let row = rowStart; row <= rowEnd; row += 1) {
        for (let col = colStart; col <= colEnd; col += 1) {
          const distance = Math.hypot(origin.row - row, origin.col - col);
          if (distance > MAX_WAVE_DISTANCE) continue;
          const idx = getIndex(row, col, currentGrid.cols);
          const node = cellRefs.current[idx];
          if (!node) continue;

          const delay = Math.max(0, distance * ANIMATION_DELAY);
          const duration = clamp(BASE_DURATION + distance * DURATION_STEP, 110, 320);
          node.style.animation = `${animationName} ${duration}ms ease-out ${delay}ms both`;
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (rafMoveRef.current) {
        window.cancelAnimationFrame(rafMoveRef.current);
      }

      rafMoveRef.current = window.requestAnimationFrame(() => {
        const currentGrid = gridRef.current;
        if (!currentGrid) return;

        const cell = toGridCell(event.clientX, event.clientY, currentGrid);
        setHoveredCell(cell);
        if (!cell || prefersReducedMotion) return;

        const lastCell = lastCellRef.current;
        if (lastCell && lastCell.row === cell.row && lastCell.col === cell.col) return;

        const now = performance.now();
        if (now - lastTrailRef.current < TRAIL_INTERVAL) return;
        lastTrailRef.current = now;
        lastCellRef.current = cell;
        triggerWave(cell);
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      const currentGrid = gridRef.current;
      if (!currentGrid) return;
      const cell = toGridCell(event.clientX, event.clientY, currentGrid);
      if (!cell) return;
      lastCellRef.current = cell;
      triggerWave(cell);
    };

    const onPointerLeaveWindow = () => setHoveredCell(null);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerleave', onPointerLeaveWindow);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerleave', onPointerLeaveWindow);
      if (rafMoveRef.current) {
        window.cancelAnimationFrame(rafMoveRef.current);
      }
    };
  }, [grid]);

  const gridStyle: CSSProperties = {
    gridTemplateColumns: grid ? `repeat(${grid.cols}, ${grid.cellSize}px)` : undefined,
    gridTemplateRows: grid ? `repeat(${grid.rows}, ${grid.cellSize}px)` : undefined,
    width: grid ? grid.cols * grid.cellSize : 0,
    height: grid ? grid.rows * grid.cellSize : 0,
    transform: grid ? `translate3d(${grid.offsetX}px, ${grid.offsetY}px, 0)` : undefined
  };

  return (
    <div className="ripple-background" aria-hidden="true">
      <div className="ripple-frame" ref={frameRef}>
        <div className="ripple-grid" style={gridStyle}>
          {cells.map((idx) => (
            <div
              key={idx}
              ref={(node) => {
                cellRefs.current[idx] = node;
              }}
              className="ripple-cell"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
