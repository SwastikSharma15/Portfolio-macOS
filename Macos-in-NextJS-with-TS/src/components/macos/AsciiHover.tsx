"use client";

import React, { useEffect, useRef } from "react";

const CELL_SIZE = 6;
const CELL_GAP = 1;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const ASCII_COLOR = "#ffffff";
const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BRIGHTNESS_THRESHOLD = 0.4;
const HOVER_RADIUS = 10;
const HOVER_PUSH = 7;
const HOVER_EASE = 0.3;
const SCATTER_RANGE = 20;
const SCATTER_EASE = 0.075;
const GRAVITY = 0.05;
const BOUNCE = 0.25;
const RESET_EASE = 0.05;
const STAGGER_FRAMES = 6;

interface AsciiHoverProps {
  text?: string;
}

interface AsciiCell {
  col: number;
  row: number;
  char: string;
  offsetX: number;
  offsetY: number;
  fallSpeed: number;
  wait: number;
  scatterX: number;
  scatterY: number;
}

const randomAsciiChar = () => {
  return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
};

export const AsciiHover: React.FC<AsciiHoverProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    // Cap devicePixelRatio at 2 for performance on Retina/High-DPI screens
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let phase = "logo";
    const cursor = { col: -999, row: -999 };
    let gridCols = 0;
    let gridRows = 0;
    let asciiCells: AsciiCell[] = [];
    let animationFrameId: number;
    let resizeTimeout: NodeJS.Timeout;

    const buildAscii = () => {
      gridCols = Math.floor(window.innerWidth / CELL_STEP);
      gridRows = Math.floor(window.innerHeight / CELL_STEP);
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const sampler = document.createElement("canvas");
      sampler.width = gridCols;
      sampler.height = gridRows;
      const samplerContext = sampler.getContext("2d", { willReadFrequently: true });

      if (!samplerContext) return;

      const textY = gridRows / 2;
      const titleText = "portfolio";

      // Max width in sampler columns (60% of total columns)
      const maxAllowedWidth = gridCols * 0.6;

      let fontSize = 22; // Title font size in sampler context

      samplerContext.font = `bold italic ${fontSize}px system-ui, -apple-system, sans-serif`;
      const textWidth = samplerContext.measureText(titleText).width;

      const scale = Math.min(1, maxAllowedWidth / textWidth);
      fontSize = Math.max(10, fontSize * scale);

      samplerContext.fillStyle = "white";
      samplerContext.textAlign = "center";
      samplerContext.textBaseline = "middle";

      // Draw Title (Large & Italic, placed right below the subtitle line)
      samplerContext.font = `bold italic ${fontSize}px system-ui, -apple-system, sans-serif`;
      samplerContext.fillText(
        titleText,
        gridCols / 2,
        textY + fontSize * 0.15
      );

      const { data } = samplerContext.getImageData(0, 0, gridCols, gridRows);

      const litCells = new Set<string>();
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const pixel = (row * gridCols + col) * 4;
          const alpha = data[pixel + 3] / 255;
          const brightness =
            ((data[pixel] * 0.299 + data[pixel + 1] * 0.587 + data[pixel + 2] * 0.114) /
              255) *
            alpha;
          if (brightness > BRIGHTNESS_THRESHOLD) {
            litCells.add(`${col},${row}`);
          }
        }
      }

      asciiCells = [];
      for (const key of litCells) {
        const [col, row] = key.split(",").map(Number);
        asciiCells.push({
          col,
          row,
          char: randomAsciiChar(),
          offsetX: 0,
          offsetY: 0,
          fallSpeed: 0,
          wait: 0,
          scatterX: (Math.random() - 0.5) * SCATTER_RANGE,
          scatterY: (Math.random() - 0.5) * SCATTER_RANGE,
        });
      }
    };

    const easeToward = (
      cell: AsciiCell,
      targetX: number,
      targetY: number,
      ease: number
    ) => {
      cell.offsetX += (targetX - cell.offsetX) * ease;
      cell.offsetY += (targetY - cell.offsetY) * ease;
    };

    const staggerCells = () => {
      for (const cell of asciiCells) {
        cell.wait = Math.floor(Math.random() * STAGGER_FRAMES);
      }
    };

    const updateAsciiCells = () => {
      let everyoneHome = phase === "returning";
      for (const cell of asciiCells) {
        if (cell.wait > 0) {
          cell.wait--;
          everyoneHome = false;
          continue;
        }
        if (phase === "scattered") {
          easeToward(cell, cell.scatterX, cell.scatterY, SCATTER_EASE);
        } else if (phase === "fallen") {
          const floorOffset = gridRows - 1 - cell.row;
          cell.fallSpeed += GRAVITY;
          cell.offsetY += cell.fallSpeed;
          if (cell.offsetY > floorOffset) {
            cell.offsetY = floorOffset;
            cell.fallSpeed *= -BOUNCE;
          }
        } else if (phase === "returning") {
          easeToward(cell, 0, 0, RESET_EASE);
          if (Math.abs(cell.offsetX) > 0.05 || Math.abs(cell.offsetY) > 0.05) {
            everyoneHome = false;
          }
        } else {
          let targetX = 0;
          let targetY = 0;
          const distX = cell.col - cursor.col;
          const distY = cell.row - cursor.row;
          const distance = Math.sqrt(distX * distX + distY * distY);
          if (distance < HOVER_RADIUS && distance > 0) {
            const push = (1 - distance / HOVER_RADIUS) * HOVER_PUSH;
            targetX = (distX / distance) * push;
            targetY = (distY / distance) * push;
          }
          easeToward(cell, targetX, targetY, HOVER_EASE);
        }

        // Matrix Effect: continuous ASCII character flicker from initial render
        const isMoving =
          Math.abs(cell.offsetX) > 0.1 ||
          Math.abs(cell.offsetY) > 0.1 ||
          Math.abs(cell.fallSpeed) > 0;
        if (Math.random() < (isMoving ? 0.18 : 0.12)) {
          cell.char = randomAsciiChar();
        }
      }
      if (everyoneHome) phase = "logo";
    };

    const drawAscii = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      context.font = `${CELL_SIZE + 1}px monospace`;
      context.textBaseline = "top";
      context.textAlign = "center";
      context.fillStyle = ASCII_COLOR;

      for (const { col, row, char, offsetX, offsetY } of asciiCells) {
        const x = (col + offsetX) * CELL_STEP + CELL_SIZE / 2;
        const y = (row + offsetY) * CELL_STEP;

        context.fillText(char, x, y);
      }
    };

    const renderLoop = () => {
      // Pause loop when document is hidden (tab switched) to save 100% CPU/GPU
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      if (asciiCells.length > 0) {
        updateAsciiCells();
        drawAscii();
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const handleMouseMove = (event: MouseEvent) => {
      cursor.col = event.clientX / CELL_STEP;
      cursor.row = event.clientY / CELL_STEP;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const isExcluded = target.closest(
          "#navbar, nav, header, #dock, .dock-container, .dock-icon, .folder, .window, .window-root, .window-header, .react-draggable, .ios-widget, aside, [data-widget], button, a, input, textarea, select, [role='button'], [data-tooltip-id]"
        );
        if (isExcluded) return;
      }

      if (asciiCells.length === 0) return;
      if (phase === "logo") {
        phase = "scattered";
        staggerCells();
      } else if (phase === "scattered") {
        phase = "fallen";
        for (const cell of asciiCells) cell.fallSpeed = 0;
      } else if (phase === "fallen") {
        phase = "returning";
        staggerCells();
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(buildAscii, 150);
    };

    buildAscii();
    renderLoop();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default AsciiHover;
