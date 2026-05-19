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

      // Entrance: more advanced antigravity-like lift + small rotate + depth
      // We'll stagger based on DOM order and element size so larger cards have a slightly longer, more floaty entrance.
      const entranceTimeline = gsap.timeline();

      floatTargets.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const area = rect.width * rect.height;
        // areaFactor: 0..1 roughly
        const areaFactor = Math.min(1, Math.max(0, area / (800 * 400)));

        const baseOffsetY = 40 + areaFactor * 40; // bigger elements come from further
        const baseOffsetZ = 8 + areaFactor * 12;
        const baseRot = (i % 2 === 0 ? 1 : -1) * (2 + Math.round(areaFactor * 4));
        const baseDur = 0.8 + areaFactor * 0.9;

        // initial entrance from below + tiny rotation + z translation
        entranceTimeline.fromTo(
          el,
          { y: baseOffsetY, z: baseOffsetZ, rotation: baseRot * 0.6, opacity: 0, transformPerspective: 800 },
          {
            y: 0,
            z: 0,
            rotation: 0,
            opacity: 1,
            duration: baseDur,
            ease: 'power3.out',
            force3D: true,
            stagger: 0,
          },
          i * 0.06,
        );

        // after entrance, start a subtle looping antigravity drift (small x/y/z + rotation)
        const ampY = 6 + (i % 4);
        const ampX = 3 + (i % 3);
        const rot = baseRot * 0.4;
        const dur = 3 + (i % 5) * 0.4;

        gsap.to(el, {
          y: `+=${ampY}`,
          x: `+=${ampX}`,
          rotation: rot,
          z: `+=${(i % 3) + 1}`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          duration: dur,
          delay: baseDur + (i % 4) * 0.04,
          force3D: true,
        });

        // slight breathing scale
        gsap.to(el, { scale: 1.004 + areaFactor * 0.003, duration: dur * 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: baseDur + 0.1 });

        // child text reveals inside element (p, h, small text)
        const texts = Array.from(el.querySelectorAll<HTMLElement>('h1,h2,h3,p,.text-sm,.text-muted-foreground'));
        if (texts.length > 0) {
          gsap.fromTo(
            texts,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.03, delay: baseDur * 0.25 },
          );
        }
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
