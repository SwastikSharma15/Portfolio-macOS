import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react';
import React, { useLayoutEffect, useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import { toCanvas } from 'html-to-image';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
const DUR = 500;

/**
 * Get the dock icon's bounding rect for a given window key.
 */
function getDockIconRect(windowKey: string): { x: number; y: number; width: number; height: number } | null {
  const mappedKey = windowKey === 'txtfile' || windowKey === 'imgfile' ? 'finder' : windowKey;
  const iconEl = document.querySelector(`[data-app-id="${mappedKey}"]`) as HTMLElement;
  if (iconEl) {
    const rect = iconEl.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }
  return {
    x: window.innerWidth / 2 - 24,
    y: window.innerHeight - 48,
    width: 48,
    height: 48
  };
}

// ─── Genie Math ───────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eioC = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eIn2 = (t: number) => t * t;
const eOut2 = (t: number) => 1 - (1 - t) * (1 - t);

function renderGenie(
  ctx: CanvasRenderingContext2D,
  off: HTMLCanvasElement,
  W: number,
  H: number,
  rawT: number,
  dir: "open" | "minimize",
  dock: { x: number; y: number },
  win: { x: number; y: number },
  WIN_W: number,
  WIN_H: number
): void {
  ctx.clearRect(0, 0, W, H);
  for (let y = 0; y < WIN_H; y++) {
    const r = y / WIN_H;
    const rowXStart = dir === "minimize" ? (1 - r) * 0.65 : r * 0.65;
    const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
    const xE = eioC(xP);
    const rowYStart = dir === "minimize" ? (1 - r) * 0.2 : r * 0.2;
    const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
    const yE = eIn2(yP);
    let left: number, right: number, destY: number;
    if (dir === "minimize") {
      left = lerp(win.x, dock.x, xE);
      right = lerp(win.x + WIN_W, dock.x, xE);
      destY = lerp(win.y + y, dock.y, yE);
    } else {
      left = lerp(dock.x, win.x, xE);
      right = lerp(dock.x, win.x + WIN_W, xE);
      destY = lerp(dock.y, win.y + y, yE);
    }
    const rowW = right - left;
    if (rowW < 0.8) continue;
    ctx.drawImage(off, 0, y, WIN_W, 1, left, destY, rowW, 1);
  }
  const glowRaw = dir === "minimize" ? rawT : 1 - rawT;
  if (glowRaw > 0.75) {
    const a = eOut2((glowRaw - 0.75) / 0.25) * 0.3;
    const hex = Math.round(a * 255).toString(16).padStart(2, "0");
    const g = ctx.createRadialGradient(dock.x, dock.y, 0, dock.x, dock.y, 55);
    g.addColorStop(0, "#ffffff" + hex);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

const WindowWrapper = (Component: React.ComponentType<any>, windowKey: any) => {
  const Wrapped = React.memo((props: any) => {
    const focusWindow = useWindowStore(state => state.focusWindow);
    const finishClose = useWindowStore(state => state.finishClose);
    const windowState = useWindowStore(state => state.windows[windowKey as keyof typeof state.windows]);
    const { isOpen, isClosing, isMaximized, zIndex, originRect } = windowState || {};

    const ref = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animation state tracking
    const rafRef = useRef<number>(0);
    const isAnimatingRef = useRef(false);
    const prevIsOpen = useRef(false);
    const prevIsClosing = useRef(false);
    const cachedCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const getOrigin = useCallback(() => {
      return originRect || getDockIconRect(windowKey);
    }, [originRect]);

    // ── Background Snapshot Caching ──
    useEffect(() => {
      if (!isOpen || isClosing || isMobile) return;
      const el = contentRef.current;
      if (!el) return;

      let timeoutId: NodeJS.Timeout;
      let idleId: number;

      const takeSnapshot = () => {
        const run = async () => {
          try {
            const offCanvas = await toCanvas(el, {
              pixelRatio: 1,
              cacheBust: false,
              skipFonts: true,
              fontEmbedCSS: '',
              filter: (node: any) => {
                if (node?.tagName?.toUpperCase() === 'LINK') return false;
                if (node?.tagName?.toUpperCase() === 'STYLE') return false;
                if (node?.tagName?.toUpperCase() === 'IFRAME') return false;
                if (node?.tagName?.toUpperCase() === 'VIDEO') return false;
                return true;
              }
            });
            cachedCanvasRef.current = offCanvas;
          } catch (e) {
            console.warn("Background snapshot failed:", e);
          }
        };

        if ('requestIdleCallback' in window) {
          idleId = (window as any).requestIdleCallback(run);
        } else {
          idleId = setTimeout(run, 50) as unknown as number;
        }
      };

      const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        if (idleId) (window as any).cancelIdleCallback?.(idleId);
        timeoutId = setTimeout(takeSnapshot, 1500);
      });

      observer.observe(el, { childList: true, subtree: true, characterData: true, attributes: true });

      // Initial snapshot after open
      timeoutId = setTimeout(takeSnapshot, 500);

      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
        if (idleId) (window as any).cancelIdleCallback?.(idleId);
      };
    }, [isOpen, isClosing]);

    // ── Genie OPEN / CLOSE animation ──
    useEffect(() => {
      const el = ref.current;
      const content = contentRef.current;
      const canvas = canvasRef.current;

      if (!el || !content || !canvas || isMobile) {
        if (isClosing && isMobile) finishClose(windowKey);
        else if (isOpen && isMobile && el) {
          el.style.display = 'block';
          el.style.opacity = '1';
        }
        return;
      }

      // We only want to trigger animations on STATE TRANSITIONS, not arbitrary re-renders.
      const justOpened = isOpen && !prevIsOpen.current;
      const justClosing = isClosing && !prevIsClosing.current;

      prevIsOpen.current = isOpen;
      prevIsClosing.current = isClosing;

      const runAnim = async (dir: "open" | "minimize") => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        cancelAnimationFrame(rafRef.current);

        const origin = getOrigin();
        if (!origin) {
          if (dir === 'open') {
            el.style.display = 'block';
            gsap.fromTo(el, { scale: 0.8, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
          } else {
            gsap.to(el, { scale: 0.8, opacity: 0, y: 40, duration: 0.3, ease: 'power3.in', onComplete: () => finishClose(windowKey) });
          }
          isAnimatingRef.current = false;
          return;
        }

        const dockCenter = { x: origin.x + origin.width / 2, y: origin.y + origin.height / 2 };

        // Prepare DOM for snapshot
        el.style.display = 'block';
        if (dir === 'open') {
          // Hide it so it doesn't flash before the animation!
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        } else {
          // During minimize, it stays visible while we prepare canvas
          el.style.opacity = '1';
          el.style.pointerEvents = 'none';
        }

        let offCanvas: HTMLCanvasElement;

        // Use cached snapshot if available (makes minimize instant!)
        if (dir === 'minimize' && cachedCanvasRef.current) {
          offCanvas = cachedCanvasRef.current;
        } else {
          // Force layout paint
          await new Promise(r => requestAnimationFrame(r));
          const winRect = el.getBoundingClientRect();

          try {
            offCanvas = await toCanvas(content, {
              pixelRatio: 1,
              cacheBust: false,
              skipFonts: true,
              fontEmbedCSS: '', // Force skip font fetching (prevents slow cross-origin CSS rule reading)
              filter: (node: any) => {
                if (node?.tagName?.toUpperCase() === 'LINK') return false;
                if (node?.tagName?.toUpperCase() === 'STYLE') return false;
                if (node?.tagName?.toUpperCase() === 'IFRAME') return false;
                // Skip heavy video elements during snapshot
                if (node?.tagName?.toUpperCase() === 'VIDEO') return false;
                return true;
              }
            });
          } catch (e) {
            console.error("Genie snapshot failed:", e);
            if (dir === 'minimize') finishClose(windowKey);
            else { el.style.opacity = '1'; el.style.pointerEvents = 'auto'; }
            isAnimatingRef.current = false;
            return;
          }
        }

        const winRect = el.getBoundingClientRect();

        // Snapshot is ready! Setup the canvas overlay
        canvas.style.display = 'block';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          isAnimatingRef.current = false;
          return;
        }
        ctx.scale(dpr, dpr);

        // Hide the real window now that we have a snapshot
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';

        let start: number | null = null;
        const frame = (ts: number) => {
          if (!start) start = ts;
          const rawT = clamp((ts - start) / DUR, 0, 1);
          renderGenie(
            ctx,
            offCanvas,
            w,
            h,
            rawT,
            dir,
            dockCenter,
            { x: winRect.left, y: winRect.top },
            winRect.width,
            winRect.height
          );

          if (rawT < 1) {
            rafRef.current = requestAnimationFrame(frame);
          } else {
            // Animation finished
            canvas.style.display = 'none';
            isAnimatingRef.current = false;

            if (dir === 'minimize') {
              finishClose(windowKey);
            } else {
              el.style.opacity = '1';
              el.style.pointerEvents = 'auto';
            }
          }
        };
        rafRef.current = requestAnimationFrame(frame);
      };

      if (justClosing) {
        runAnim('minimize');
      } else if (justOpened) {
        runAnim('open');
      } else if (isOpen && !isClosing && !isAnimatingRef.current) {
        // Window is open and stable
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      } else if (!isOpen && !isClosing && !isAnimatingRef.current) {
        // Window is closed and stable
        el.style.display = 'none';
        el.style.opacity = '0';
      }

      return () => {
        // We do not cancel rafRef here because re-renders shouldn't interrupt the async flow.
      };
    }, [isOpen, isClosing, finishClose, windowKey, getOrigin]);

    // draggable handling
    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      if (!isOpen || isMaximized || isMobile) {
        Draggable.get(el)?.kill();
        return;
      }

      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
        trigger: el.querySelector('.window-drag-handle'),
        ignore: "input[type='range'], button, button *, .sliders, a, svg",
        cursor: "grab",
        activeCursor: "grabbing"
      })

      return () => instance.kill();
    }, [isOpen, isMaximized, focusWindow]);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      // toggle maximized styles
      if (isMaximized) {
        if (!el.dataset.prevTop) {
          const cs = window.getComputedStyle(el);
          el.dataset.prevTop = cs.top;
          el.dataset.prevLeft = cs.left;
          el.dataset.prevWidth = cs.width;
          el.dataset.prevHeight = cs.height;
          el.dataset.prevPosition = cs.position;
          el.dataset.prevTransform = cs.transform;
          el.dataset.prevMaxWidth = cs.maxWidth;
          el.dataset.prevRight = cs.right;
          el.dataset.prevBottom = cs.bottom;
        }
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.right = '0';
        el.style.bottom = '0';
        el.style.width = '100dvw';
        el.style.height = '100dvh';
        el.style.maxWidth = 'none';
        el.style.transform = 'none';
      } else {
        if (el.dataset.prevTop) {
          el.style.top = el.dataset.prevTop;
          el.style.left = el.dataset.prevLeft;
          el.style.width = el.dataset.prevWidth;

          if (windowKey === 'contact') {
            el.style.height = '';
          } else if (el.dataset.prevHeight !== 'auto') {
            el.style.height = el.dataset.prevHeight;
          } else {
            el.style.height = '';
          }

          if (el.dataset.prevPosition) el.style.position = el.dataset.prevPosition;
          if (el.dataset.prevMaxWidth) el.style.maxWidth = el.dataset.prevMaxWidth;
          if (el.dataset.prevTransform) el.style.transform = el.dataset.prevTransform;
          el.style.right = '';
          el.style.bottom = '';
          delete el.dataset.prevTop;
          delete el.dataset.prevLeft;
          delete el.dataset.prevWidth;
          delete el.dataset.prevHeight;
          delete el.dataset.prevPosition;
          delete el.dataset.prevTransform;
          delete el.dataset.prevMaxWidth;
          delete el.dataset.prevRight;
          delete el.dataset.prevBottom;
        }
      }
    }, [isMaximized]);

    return (
      <div
        style={{ zIndex }}
        className='fixed inset-0 pointer-events-none'
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50 hidden" style={{ width: '100%', height: '100%' }} />
        <section
          id={windowKey}
          ref={ref}
          // Use style instead of Tailwind classes to ensure initial opacity 0 before JS takes over
          className='absolute window-root pointer-events-auto shadow-2xl drop-shadow-2xl'
          style={{ opacity: 0, display: 'none' }}
          onClick={() => focusWindow(windowKey)}>
          <div ref={contentRef} className="w-full h-full relative" style={{ borderRadius: 'inherit', background: 'inherit' }}>
            <Component {...props} />
          </div>
        </section>
      </div>
    )
  });

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}

export default WindowWrapper