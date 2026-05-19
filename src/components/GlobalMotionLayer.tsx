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

    // subtle entrance for headings
    try {
      gsap.fromTo(
        '.tracking-tight, .fw-reveal h1, .fw-reveal h2',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 },
      );

      // continuous gentle float for elements marked with data-motion
      const floatTargets = document.querySelectorAll<HTMLElement>('[data-motion]');
      floatTargets.forEach((el, i) => {
        const amplitude = 4 + (i % 3);
        const dur = 3 + (i % 4) * 0.6;
        gsap.to(el, {
          y: `+=${amplitude}`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          duration: dur,
          delay: (i % 5) * 0.08,
          force3D: true,
        });
      });

      // gentle staggered reveal for paragraph text
      gsap.fromTo(
        'section p, .CardContent p, .text-sm',
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.03, delay: 0.12 },
      );
    } catch (err) {
      // fail silently if gsap isn't available or selectors mismatch
      // console.warn('GlobalMotionLayer error', err);
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
