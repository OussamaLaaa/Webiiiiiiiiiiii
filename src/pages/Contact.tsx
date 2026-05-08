import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getCardClass, getGlassClass } from '../components/designSystem';

interface ContactCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  action: string;
  color: string;
  hoverColor: string;
}

const Contact: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { persistentUI, visibility } = siteConfig;
  
  const [isLightMode, setIsLightMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const contactCards: ContactCard[] = [
    {
      id: 'instagram',
      title: 'Instagram',
      subtitle: '@studio.work',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: 'https://instagram.com',
      action: 'Follow',
      color: '#E1306C',
      hoverColor: '#C13584',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      subtitle: '/in/studio',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: 'https://linkedin.com',
      action: 'Connect',
      color: '#0077B5',
      hoverColor: '#005885',
    },
    {
      id: 'twitter',
      title: 'X (Twitter)',
      subtitle: '@studio',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: 'https://twitter.com',
      action: 'Follow',
      color: '#000000',
      hoverColor: '#333333',
    },
    {
      id: 'github',
      title: 'GitHub',
      subtitle: '/studio',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      href: 'https://github.com',
      action: 'Code',
      color: '#ffffff',
      hoverColor: '#e0e0e0',
    },
    {
      id: 'dribbble',
      title: 'Dribbble',
      subtitle: '/studio',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
        </svg>
      ),
      href: 'https://dribbble.com',
      action: 'Shots',
      color: '#EA4C89',
      hoverColor: '#D6336C',
    },
    {
      id: 'email',
      title: 'hello@studio.com',
      subtitle: 'Tap to copy',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      href: 'mailto:hello@studio.com',
      action: 'Say Hi',
      color: '#EA4335',
      hoverColor: '#c53224',
    },
  ];

  useEffect(() => {
    // Detect light mode from parent
    const checkLightMode = () => {
      const isLight = document.body.classList.contains('dashboard-page');
      setIsLightMode(isLight);
    };
    
    checkLightMode();
    const observer = new MutationObserver(checkLightMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate hero section
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );
    }

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 }
      );
    }

    // Animate form section
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );
    }

    // Animate sidebar
    const sidebar = containerRef.current.querySelector('.contact-sidebar');
    if (sidebar) {
      gsap.fromTo(
        sidebar,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
      );
    }

    // Animate social cards with stagger
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.social-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 1,
        }
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardHover = (card: HTMLElement, isEntering: boolean, color: string, hoverColor: string) => {
    if (isEntering) {
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        duration: 0.4,
        ease: 'power2.out',
      });
      
      const icon = card.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          color: hoverColor,
          duration: 0.3,
        });
      }
      
      gsap.to(card, {
        boxShadow: `0 20px 40px -10px ${color}40`,
        duration: 0.4,
      });
    } else {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
      
      const icon = card.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          color: color,
          duration: 0.3,
        });
      }
      
      gsap.to(card, {
        boxShadow: 'none',
        duration: 0.4,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  if (!visibility.persistentUI) return null;

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${isLightMode ? 'bg-[#f8f9fa]' : 'bg-[#08080a]'} transition-colors duration-500`}
      data-surface="base"
    >
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[250] glass-nav">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="relative h-[80px] md:h-[96px] flex items-center">
            {/* Logo */}
            <a
              href="#/"
              className="flex-shrink-0 group"
            >
              <img
                src={isLightMode ? persistentUI.logoLightSrc || '/logo-black.png' : persistentUI.logoDarkSrc || '/logo-white.png'}
                alt={persistentUI.logoAlt}
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-400 group-hover:scale-105"
              />
            </a>

            {/* Back to Home Button */}
            <div className="ml-auto">
              <a
                href="#/"
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-400 ${
                  isLightMode
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1152px] mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1
              ref={titleRef}
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight ${
                isLightMode ? 'text-gray-900' : 'text-white'
              }`}
            >
              Got plans? Let's turn them
              <br />
              into something real.
            </h1>
            <p
              ref={subtitleRef}
              className={`text-base md:text-lg ${isLightMode ? 'text-gray-600' : 'text-gray-400'} max-w-[576px] mx-auto leading-relaxed`}
            >
              Tell us what's on your mind — a product, a brand, an idea half-sketched on a napkin. We read every message.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-16" />

          {/* Contact Section with Sidebar and Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Sidebar */}
            <div className="contact-sidebar lg:col-span-4 space-y-4">
              {/* Direct Contact Card */}
              <div
                className={`p-6 rounded-2xl ${getCardClass('card-2', isLightMode ? 'light' : 'dark')}`}
                style={{
                  borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? '#fff' : '#000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    Direct
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-1 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? '#666' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Phone
                      </p>
                      <p className={`text-sm font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                        +49 211 84 73 00
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-1 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? '#666' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Email
                      </p>
                      <div className="flex items-center gap-2">
                        <a href="mailto:hello@studio.com" className={`text-sm font-medium hover:underline ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                          hello@studio.com
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText('hello@studio.com')}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            isLightMode ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? '#666' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-1 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? '#666' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Office
                      </p>
                      <p className={`text-sm font-medium leading-relaxed ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                        Königsallee 27
                        <br />
                        40212 Düsseldorf, Germany
                      </p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      Available for new projects · Mon–Fri
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Time Card */}
              <div
                className={`p-6 rounded-2xl border ${getCardClass('card-2', isLightMode ? 'light' : 'dark')}`}
                style={{
                  borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  Response time
                </p>
                <p className={`text-lg font-semibold mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                  Within 24 hours
                </p>
                <p className={`text-sm leading-relaxed ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  Every inquiry is read by a partner — no auto-replies, no funnels.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div
              ref={formRef}
              className="lg:col-span-8"
            >
              <div
                className={`p-8 rounded-2xl ${getCardClass('card-2', isLightMode ? 'light' : 'dark')}`}
                style={{
                  borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className={`text-2xl font-semibold mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                      Send us a message
                    </h2>
                    <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      Fill in a few details — we'll get back to you shortly.
                    </p>
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    01 / Form
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jane Smith"
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isLightMode
                            ? 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300'
                            : 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20'
                        }`}
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane@framer.com"
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isLightMode
                            ? 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300'
                            : 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Project inquiry"
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isLightMode
                          ? 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300'
                          : 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20'
                      }`}
                      required
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your new idea…"
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors resize-none ${
                        isLightMode
                          ? 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300'
                          : 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20'
                      }`}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      By sending, you agree to our{' '}
                      <a href="#/privacy" className={`underline ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                        privacy policy
                      </a>
                      .
                    </p>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Submit
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Social Channels Section */}
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-xs font-medium uppercase tracking-wider mb-2 block ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  02 / Channels
                </span>
                <h2 className={`text-3xl md:text-4xl font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                  Find us elsewhere
                </h2>
              </div>
              <p className={`text-sm max-w-[384px] ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Pick the channel that suits you. Hover a card to see it come alive.
              </p>
            </div>

            {/* Social Cards Grid */}
            <div
              ref={cardsRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {contactCards.map((card) => (
                <a
                  key={card.id}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-card group relative p-6 rounded-2xl transition-all duration-400 ${getCardClass(
                    'card-2',
                    isLightMode ? 'light' : 'dark'
                  )}`}
                  onMouseEnter={(e) => handleCardHover(e.currentTarget, true, card.color, card.hoverColor)}
                  onMouseLeave={(e) => handleCardHover(e.currentTarget, false, card.color, card.hoverColor)}
                  style={{
                    borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {card.action}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isLightMode ? 'bg-gray-100' : 'bg-white/10'
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? '#666' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3">
                    <div
                      className="card-icon w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
                      style={{ backgroundColor: isLightMode ? '#ECEEF2' : '#ECEEF2' }}
                    >
                      <div style={{ color: card.color }}>
                        {card.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-base font-semibold mb-0.5 ${
                          isLightMode ? 'text-gray-900' : 'text-white'
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`text-xs ${
                          isLightMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;