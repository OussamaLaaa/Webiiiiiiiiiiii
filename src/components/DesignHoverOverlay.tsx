import React, { useEffect, useRef } from 'react';

const prefersReduced = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
};

const DesignHoverOverlay: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReduced()) return;

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.position = 'fixed';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.transition = 'opacity 160ms ease, transform 180ms ease';
    overlay.style.opacity = '0';
    overlay.style.border = '1px dashed rgba(10,12,16,0.9)';
    overlay.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
    overlay.style.boxShadow = '0 6px 20px rgba(10,12,16,0.06)';
    overlay.style.borderRadius = '6px';
    overlay.style.padding = '6px';
    overlay.style.backdropFilter = 'blur(0px)';

    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.right = '6px';
    handle.style.top = '6px';
    handle.style.width = '10px';
    handle.style.height = '10px';
    handle.style.borderRadius = '2px';
    handle.style.background = 'rgba(10,12,16,0.9)';
    handle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.18)';
    overlay.appendChild(handle);

    document.body.appendChild(overlay);
    overlayRef.current = overlay;

    let lastRect: DOMRect | null = null;

    const updateOverlay = () => {
      const el = targetRef.current;
      const o = overlayRef.current;
      if (!el || !o) return;
      const r = el.getBoundingClientRect();
      lastRect = r;
      o.style.left = `${Math.max(6, r.left - 6)}px`;
      o.style.top = `${Math.max(6, r.top - 6)}px`;
      o.style.width = `${Math.max(32, r.width + 12)}px`;
      o.style.height = `${Math.max(18, r.height + 12)}px`;
      o.style.opacity = '1';
      o.style.transform = 'translateZ(0)';
    };

    const hideOverlay = () => {
      const o = overlayRef.current;
      if (!o) return;
      o.style.opacity = '0';
    };

    const pointerMove = (e: PointerEvent) => {
      // throttle with rAF
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        if (!el) {
          targetRef.current = null;
          hideOverlay();
          return;
        }

        const candidate = el.closest('[data-designable]') as HTMLElement | null;
        if (candidate) {
          targetRef.current = candidate;
          updateOverlay();
        } else {
          targetRef.current = null;
          hideOverlay();
        }
      });
    };

    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('scroll', hideOverlay, true);

    return () => {
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('scroll', hideOverlay, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      overlay.remove();
    };
  }, []);

  return null;
};

export default DesignHoverOverlay;
