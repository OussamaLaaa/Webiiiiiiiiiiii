import React, { useEffect } from 'react';
import gsap from 'gsap';

interface GlobalMotionLayerProps {
  // optional tuning params can be added later
}

const prefersReduced = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
};

const GlobalMotionLayer: React.FC<GlobalMotionLayerProps> = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReduced()) return;

    try {
      // Entrance: headings and section titles
      gsap.fromTo(
        '.tracking-tight, .fw-reveal h1, .fw-reveal h2, h1.tracking-tight',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.05 },
      );

      // Paragraphs and small text entrance
      gsap.fromTo(
        'section p, .CardContent p, .text-sm, .text-muted-foreground',
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.02, delay: 0.08 },
      );

      // Antigravity float: for elements flagged with data-motion apply gentle multi-axis drift + rotation
      const floatTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-motion]'));

      floatTargets.forEach((el, i) => {
        const seed = i + 1;
        const ampY = 6 + (seed % 4); // vertical amplitude
        const ampX = 4 + (seed % 3); // horizontal amplitude
        const rot = (seed % 2 === 0 ? 1 : -1) * (2 + (seed % 3));
        const baseDur = 3 + (seed % 5) * 0.5;

        // composite timeline for each element
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(el, { y: `+=${ampY}`, x: `+=${ampX}`, rotation: rot, duration: baseDur, ease: 'sine.inOut', force3D: true });
        tl.to(el, { y: `-=${ampY}`, x: `-=${ampX}`, rotation: -rot, duration: baseDur * 1.1, ease: 'sine.inOut' }, '+=0');
        // slight scale breathing
        gsap.to(el, { scale: 1.005 + (seed % 2) * 0.003, duration: baseDur * 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: (i % 4) * 0.05 });
      });
    } catch (err) {
      // ignore
    }

    return () => {
      try {
        gsap.globalTimeline.clear();
      } catch (e) {}
    };
  }, []);

  return null;
};

export default GlobalMotionLayer;
