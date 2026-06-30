'use client';

import { useEffect, useRef } from 'react';

/**
 * Light, mouse-tracking cloud-glow background for hero sections — a soft
 * emerald glow that drifts toward the cursor over a near-white base, with a
 * faint film grain. Inspired by the SkySign marketing hero.
 */
export function CloudGlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.7, y: 0.25 });
  const current = useRef({ x: 0.7, y: 0.25 });
  const raf = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const cloud = cloudRef.current;
    if (!container || !cloud) return;

    const lerp = 0.045;
    const SETTLE = 0.0001;

    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      if (Math.abs(dx) < SETTLE && Math.abs(dy) < SETTLE) {
        running.current = false;
        return;
      }
      current.current.x += dx * lerp;
      current.current.y += dy * lerp;
      const px = (current.current.x - 0.5) * 320;
      const py = (current.current.y - 0.5) * 220;
      cloud.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px)`;
      raf.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!running.current) {
        running.current = true;
        raf.current = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      start();
    };
    const onLeave = () => {
      target.current = { x: 0.7, y: 0.25 };
      start();
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });
    start();
    return () => {
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 cloud-bg" />
      <div
        ref={cloudRef}
        className="absolute will-change-transform"
        style={{
          top: '30%',
          left: '70%',
          width: '760px',
          height: '560px',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(ellipse at center, rgba(74,206,148,0.32) 0%, rgba(34,181,115,0.10) 42%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-60"
        style={{
          maskImage:
            'radial-gradient(120% 100% at 50% 0%, black 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(120% 100% at 50% 0%, black 0%, transparent 75%)',
        }}
      />
      <div className="absolute inset-0 grain opacity-[0.05]" />
    </div>
  );
}
