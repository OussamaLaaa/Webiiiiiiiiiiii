import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GlobalMotionLayerProps {}

const prefersReduced = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

function splitTextToSpans(el: HTMLElement) {
  if (el.children.length > 0) return [];
  const text = el.textContent || '';
  if (!text.trim()) return [];
  el.textContent = '';
  const chars = text.split('');
  return chars.map((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    el.appendChild(span);
    return span;
  });
}

function splitToWords(el: HTMLElement) {
  if (el.children.length > 0) return [];
  const text = el.textContent || '';
  if (!text.trim()) return [];
  el.textContent = '';
  const words = text.split(/\s+/);
  const spans: HTMLSpanElement[] = [];
  words.forEach((word, i) => {
    if (i > 0) {
      const space = document.createElement('span');
      space.textContent = '\u00A0';
      space.style.display = 'inline-block';
      el.appendChild(space);
    }
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    el.appendChild(span);
    spans.push(span);
  });
  return spans;
}

const GlobalMotionLayer: React.FC<GlobalMotionLayerProps> = () => {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReduced()) return;

    const ctx = gsap.context(() => {
      try {
        const root = document.querySelector('[data-surface="static-home"]');
        if (!root) return;

        const hero = document.getElementById('home');
        const isMobile = window.innerWidth < 768;
        const viewportH = window.innerHeight;

        function isInViewport(el: Element) {
          const r = el.getBoundingClientRect();
          return r.top < viewportH && r.bottom > 0;
        }

        function animateFrom(section: HTMLElement, selector: string, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, isInitialViewport: boolean) {
          const el = section.querySelectorAll<HTMLElement>(selector);
          if (!el.length) return;

          if (isInitialViewport) {
            gsap.fromTo(el, fromVars, { ...toVars, immediateRender: false });
          } else {
            gsap.set(el, fromVars);
            ScrollTrigger.create({
              trigger: section,
              start: 'top 82%',
              once: true,
              onEnter: () => gsap.to(el, toVars),
            });
          }
        }

        // ══════════════════════════════════════════════
        // HERO
        // ══════════════════════════════════════════════
        const heroTitle = hero?.querySelector<HTMLElement>('h1');
        if (heroTitle && !isMobile) {
          const chars = splitTextToSpans(heroTitle);
          gsap.fromTo(chars, { y: 70, opacity: 0, rotationX: -45, transformPerspective: 700 }, { y: 0, opacity: 1, rotationX: 0, duration: 0.75, ease: 'back.out(1.3)', stagger: { each: 0.022, from: 'start' } });
        } else if (heroTitle) {
          gsap.fromTo(heroTitle, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
        }

        const heroSub = hero?.querySelector<HTMLElement>('p.text-lg, p.text-xl');
        if (heroSub) {
          const words = splitToWords(heroSub);
          gsap.fromTo(words, { y: 25, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out', stagger: { each: 0.035, from: 'start' }, delay: 0.45 });
        }

        const heroBtns = hero?.querySelectorAll<HTMLElement>('.mt-10 a');
        if (heroBtns?.length) {
          gsap.fromTo(heroBtns, { y: 35, opacity: 0, scale: 0.93 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power4.out', stagger: 0.1, delay: 0.75 });
        }

        const avatarStrip = hero?.querySelector<HTMLElement>('.mt-14');
        if (avatarStrip) {
          gsap.fromTo(avatarStrip, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 1.0 });
        }

        const marquee = hero?.querySelector<HTMLElement>('[class*="Marquee"], [class*="experience"]');
        if (marquee) {
          ScrollTrigger.create({
            trigger: marquee,
            start: 'top 95%',
            once: true,
            onEnter: () => gsap.fromTo(marquee, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }),
          });
        }

        // ══════════════════════════════════════════════
        // SECTIONS
        // ══════════════════════════════════════════════
        const sectionConfigs = [
          { id: 'values' },
          { id: 'about' },
          { id: 'projects' },
          { id: 'testimonials' },
          { id: 'contact' },
        ];

        sectionConfigs.forEach(({ id }) => {
          const section = document.getElementById(id);
          if (!section) return;
          const initialViewport = isInViewport(section);

          // Headings
          animateFrom(
            section,
            'h2.tracking-tight, h3.tracking-tight',
            { y: 55, opacity: 0, rotateX: -18, transformPerspective: 800 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 },
            initialViewport,
          );

          // Eyebrow
          animateFrom(
            section,
            '.text-sm.uppercase',
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.05 },
            initialViewport,
          );

          // Paragraphs
          animateFrom(
            section,
            'p.text-muted-foreground, p.leading-relaxed',
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.04, delay: 0.1 },
            initialViewport,
          );

          // Cards (3D entrance)
          animateFrom(
            section,
            '[data-motion].rounded-2xl',
            { y: 90, opacity: 0, rotateX: isMobile ? 0 : 18, rotateY: isMobile ? 0 : -6, transformPerspective: 1200, scale: 0.96 },
            { y: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1, duration: 1.2, ease: 'power4.out', stagger: 0.09, delay: 0.15 },
            initialViewport,
          );

          // Buttons
          animateFrom(
            section,
            'a[class*="rounded-full"]',
            { y: 25, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', stagger: 0.06, delay: 0.2 },
            initialViewport,
          );

          // List items
          animateFrom(
            section,
            'ul.space-y-3 > li',
            { x: -18, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04, delay: 0.25 },
            initialViewport,
          );

          // Skill chips (only for about section)
          if (id === 'about') {
            animateFrom(
              section,
              '.rounded-full',
              { scale: 0, opacity: 0, y: 15 },
              { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.025, delay: 0.3 },
              initialViewport,
            );

            // Certification items
            animateFrom(
              section,
              '.flex.items-start.gap-3.p-3',
              { x: -25, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.04, delay: 0.35 },
              initialViewport,
            );
          }
        });

        // ══════════════════════════════════════════════
        // FOOTER
        // ══════════════════════════════════════════════
        const footer = document.querySelector('footer');
        if (footer) {
          const footerInView = isInViewport(footer);
          const footGroups = footer.querySelectorAll<HTMLElement>('.md\\:col-span-4, .md\\:col-span-2, .md\\:col-span-3');
          const copyBar = footer.querySelector<HTMLElement>('.border-t > div');

          if (footerInView) {
            gsap.fromTo(footGroups, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
            if (copyBar) gsap.fromTo(copyBar, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 });
          } else {
            gsap.set(footGroups, { y: 30, opacity: 0 });
            if (copyBar) gsap.set(copyBar, { y: 15, opacity: 0 });

            ScrollTrigger.create({
              trigger: footer,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                gsap.to(footGroups, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
                if (copyBar) gsap.to(copyBar, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 });
              },
            });
          }
        }

        requestAnimationFrame(() => ScrollTrigger.refresh());

      } catch (err) {
        // ignore
      }
    });

    ctxRef.current = ctx;

    return () => {
      try {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        ctxRef.current?.revert();
      } catch (e) {}
    };
  }, []);

  return null;
};

export default GlobalMotionLayer;
