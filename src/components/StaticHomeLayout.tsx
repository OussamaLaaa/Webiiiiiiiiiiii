import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Footer } from './Footer';
import { getSocialIconComponent } from './icons';

const SECTION_IDS = ['home', 'about', 'projects', 'testimonials', 'contact'] as const;

const isPlaceholderHref = (href: string) => href.trim() === '#';

const Reveal: React.FC<{
  children: ReactNode;
  className?: string;
  delayMs?: number;
}> = ({ children, className = '', delayMs = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        isVisible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[6px]'
      } ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
};

const SectionEyebrow: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`font-mono text-[0.7rem] uppercase tracking-[0.3em] ${className}`}>{children}</p>
);

export const StaticHomeLayout: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { scene05, featured, visibility, persistentUI } = siteConfig;

  const visibleProjects = useMemo(() => siteConfig.projects.filter((project) => project.visible), [siteConfig.projects]);
  const visibleTestimonials = useMemo(
    () => siteConfig.testimonials.filter((testimonial) => testimonial.visible),
    [siteConfig.testimonials],
  );
  const visibleSkills = useMemo(() => scene05.skills.map((skill) => skill.trim()).filter(Boolean), [scene05.skills]);
  const visibleSocialLinks = useMemo(() => scene05.socialLinks.filter((link) => link.visible), [scene05.socialLinks]);
  const featuredCertifications = useMemo(
    () => scene05.featuredCertifications.filter((item) => item.visible),
    [scene05.featuredCertifications],
  );
  const visibleCompanyLogos = useMemo(
    () => scene05.companyLogos.filter((item) => item.visible),
    [scene05.companyLogos],
  );
  const visibleLogos = visibleCompanyLogos.length > 0 ? visibleCompanyLogos : scene05.companyLogos;
  const visibleCertificates = featuredCertifications.length > 0 ? featuredCertifications : scene05.certifications;
  const certificateLogos = featuredCertifications.length > 0 ? featuredCertifications : scene05.featuredCertifications;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => !!section,
    );

    if (sections.length === 0) return;

    const dispatchSection = (sectionId: string) => {
      window.dispatchEvent(new CustomEvent('nav-active-section', { detail: { section: sectionId } }));
    };

    dispatchSection('home');

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (active?.target instanceof HTMLElement) {
          dispatchSection(active.target.id);
        }
      },
      { threshold: [0.16, 0.3, 0.45, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const heroButtonClass =
    'inline-flex items-center justify-center rounded-full bg-[#111217] px-6 py-3.5 text-sm font-medium tracking-[0.01em] text-white shadow-[0_18px_34px_rgba(17,18,23,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f5f1]';
  const secondaryButtonClass =
    'inline-flex items-center justify-center rounded-full border border-[#111217]/12 bg-white px-6 py-3.5 text-sm font-medium tracking-[0.01em] text-[#111217] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#111217]/20 hover:bg-[#111217]/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f5f1]';
  const cardClass =
    'rounded-[28px] border border-[#111217]/8 bg-white shadow-[0_16px_40px_rgba(17,18,23,0.06)]';

  const storyParagraphs = scene05.storyParagraphs.map((item) => item.trim()).filter(Boolean);
  const aboutParagraphs = storyParagraphs.length > 0 ? storyParagraphs : [scene05.visionText];
  const heroStats = [
    { label: scene05.skillsTitle, value: String(visibleSkills.length) },
    { label: scene05.certificationsTitle, value: String(visibleCertificates.length) },
    { label: scene05.companyLogosTitle, value: String(visibleLogos.length) },
  ];

  const services = visibleSkills.slice(0, 4);
  const aboutNavLabel = persistentUI.navItems.find((item) => item.section === 'about')?.label || scene05.badge;
  const contactHref = persistentUI.letsTalkHref || scene05.actionHref;

  const handlePlaceholderLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPlaceholderHref(href)) {
      event.preventDefault();
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#f7f5f1] text-[#111217]" data-surface="static-home">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6%] top-[-10%] h-[24rem] w-[24rem] rounded-full bg-[#d8b27a]/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-[20rem] w-[20rem] rounded-full bg-[#7ea8ff]/12 blur-3xl" />
        <div className="absolute bottom-[14%] left-[20%] h-[16rem] w-[16rem] rounded-full bg-[#111217]/5 blur-3xl" />
      </div>

      <section id="home" className="relative border-b border-[#111217]/8">
        <div className="site-shell grid gap-12 py-20 md:py-24 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-8">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#111217]/10 bg-white px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-[#111217]/68 shadow-[0_8px_24px_rgba(17,18,23,0.05)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#111217]" />
                {scene05.badge}
              </div>
            </Reveal>

            <div className="space-y-5">
              <Reveal delayMs={80}>
                <p className="max-w-[24ch] font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[#111217]/42">
                  {scene05.role}
                </p>
              </Reveal>

              <Reveal delayMs={120}>
                <h1 className="max-w-[9ch] text-balance text-5xl font-semibold tracking-[-0.075em] text-[#111217] md:text-6xl xl:text-[4.8rem] xl:leading-[0.95]">
                  {scene05.name}
                </h1>
              </Reveal>

              <Reveal delayMs={170}>
                <p className="max-w-[38rem] text-[1rem] leading-8 text-[#111217]/72 md:text-[1.08rem]">
                  {scene05.visionText}
                </p>
              </Reveal>
            </div>

            <Reveal delayMs={220}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={contactHref}
                  onClick={(event) => handlePlaceholderLinkClick(event, contactHref)}
                  target={isPlaceholderHref(contactHref) ? undefined : '_blank'}
                  rel={isPlaceholderHref(contactHref) ? undefined : 'noopener noreferrer'}
                  className={heroButtonClass}
                >
                  {scene05.actionLabel}
                </a>
                <a href="#projects" className={secondaryButtonClass}>
                  {featured.viewAllLabel}
                </a>
              </div>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <Reveal key={stat.label} delayMs={180 + index * 60}>
                  <div className="rounded-[24px] border border-[#111217]/8 bg-white p-4 shadow-[0_14px_28px_rgba(17,18,23,0.05)]">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[#111217]/42">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#111217]">{stat.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="xl:justify-self-end" delayMs={160}>
            <div className={cardClass}>
              <div className="grid gap-5 p-5 md:p-6">
                <div className="relative overflow-hidden rounded-[30px] border border-[#111217]/8 bg-[#f2ede6]">
                  <img
                    src={scene05.portraitImage}
                    alt={scene05.portraitAlt}
                    className="h-[30rem] w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111217]/10 via-transparent to-transparent" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-[#111217]/8 bg-[#fbfaf8] p-4">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[#111217]/42">{scene05.skillsTitle}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {visibleSkills.slice(0, 4).map((skill) => (
                        <span key={skill} className="rounded-full border border-[#111217]/10 bg-white px-3 py-1.5 text-xs text-[#111217]/72">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-[#111217]/8 bg-[#fbfaf8] p-4">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[#111217]/42">{scene05.aiTitle}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scene05.aiTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full border border-[#111217]/10 bg-white px-3 py-1.5 text-xs text-[#111217]/72">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-b border-[#111217]/8 bg-white/55 py-6 md:py-7">
        <div className="site-shell">
          <Reveal>
            <div className="overflow-hidden rounded-[30px] border border-[#111217]/8 bg-white px-4 py-5 shadow-[0_16px_40px_rgba(17,18,23,0.05)] md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <SectionEyebrow>{scene05.companyLogosTitle}</SectionEyebrow>
                  <p className="mt-2 text-sm text-[#111217]/58">
                    {scene05.companyLogosTitle}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {visibleLogos.map((logo, index) => (
                  <Reveal key={logo.id} delayMs={index * 60}>
                    <a
                      href={logo.href}
                      onClick={(event) => handlePlaceholderLinkClick(event, logo.href)}
                      target={isPlaceholderHref(logo.href) ? undefined : '_blank'}
                      rel={isPlaceholderHref(logo.href) ? undefined : 'noopener noreferrer'}
                      className="flex h-full min-h-[4.5rem] items-center justify-center rounded-[20px] border border-[#111217]/8 bg-[#faf8f4] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#111217]/16 hover:bg-white"
                      aria-label={logo.name}
                    >
                      <img src={logo.logoSrc} alt={logo.name} className="max-h-8 max-w-[9rem] object-contain opacity-80" />
                    </a>
                  </Reveal>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {visibleCertificates.map((item, index) => {
                  const title = typeof item === 'string' ? item : item.title;
                  const issuer = typeof item === 'string' ? '' : item.issuer;
                  return (
                    <Reveal key={`${title}-${index}`} delayMs={index * 50}>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#111217]/8 bg-white px-3 py-2 text-xs text-[#111217]/72 shadow-[0_10px_20px_rgba(17,18,23,0.04)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d8b27a]" />
                        {title}
                        {issuer ? <span className="text-[#111217]/40">• {issuer}</span> : null}
                      </span>
                    </Reveal>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {certificateLogos.map((item, index) => {
                  const title = typeof item === 'string' ? item : item.title;
                  const logoSrc = typeof item === 'string' ? '' : item.logoSrc;
                  const issuer = typeof item === 'string' ? 'Course' : item.issuer;
                  return (
                    <Reveal key={`cert-logo-${title}-${index}`} delayMs={index * 45}>
                      <div className="flex h-full min-h-[4.75rem] items-center gap-3 rounded-[20px] border border-[#111217]/8 bg-[#faf8f4] px-4 py-3">
                        {logoSrc ? (
                          <img src={logoSrc} alt={title} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[0.68rem] font-medium text-[#111217]/60 shadow-[0_8px_16px_rgba(17,18,23,0.04)]">
                            {title.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#111217]">{title}</p>
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#111217]/42">{issuer}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="relative border-b border-[#111217]/8 py-20 md:py-24">
        <div className="site-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <Reveal>
            <div className={cardClass}>
              <div className="p-5 md:p-6">
                <SectionEyebrow>{scene05.badge}</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#111217] md:text-4xl">
                  {scene05.storyTitle}
                </h2>
                <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#111217]/72">
                  {aboutParagraphs.map((paragraph, index) => (
                    <Reveal key={paragraph} delayMs={index * 80}>
                      <p>{paragraph}</p>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {visibleSocialLinks.map((link, index) => {
                    const SocialIcon = getSocialIconComponent(link.icon);
                    return (
                      <Reveal key={link.id} delayMs={index * 50}>
                        <a
                          href={link.href}
                          onClick={(event) => handlePlaceholderLinkClick(event, link.href)}
                          target={isPlaceholderHref(link.href) ? undefined : '_blank'}
                          rel={isPlaceholderHref(link.href) ? undefined : 'noopener noreferrer'}
                          className="inline-flex items-center gap-2 rounded-full border border-[#111217]/10 bg-[#111217]/3 px-4 py-2 text-sm text-[#111217]/72 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111217]/6 hover:text-[#111217]"
                        >
                          <SocialIcon size={16} strokeWidth={1.8} />
                          {link.label}
                        </a>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            <Reveal delayMs={50}>
              <div className="rounded-[28px] border border-[#111217]/8 bg-white p-5 shadow-[0_16px_40px_rgba(17,18,23,0.05)]">
                <SectionEyebrow>{scene05.skillsTitle}</SectionEyebrow>
                <div className="mt-4 grid gap-3">
                  {services.map((service, index) => (
                    <Reveal key={service} delayMs={index * 60}>
                      <div className="flex items-center justify-between rounded-[18px] border border-[#111217]/8 bg-[#faf8f4] px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-[#111217]">{service}</p>
                        </div>
                        <span className="rounded-full border border-[#111217]/10 bg-white px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#111217]/50">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div className="rounded-[28px] border border-[#111217]/8 bg-white p-5 shadow-[0_16px_40px_rgba(17,18,23,0.05)]">
                <SectionEyebrow>{scene05.certificationsTitle}</SectionEyebrow>
                <div className="mt-4 grid gap-3">
                  {visibleCertificates.slice(0, 4).map((item, index) => {
                    const title = typeof item === 'string' ? item : item.title;
                    const issuer = typeof item === 'string' ? 'Certificate' : item.issuer;
                    return (
                      <Reveal key={`${title}-${index}`} delayMs={index * 70}>
                        <div className="rounded-[18px] border border-[#111217]/8 bg-[#faf8f4] px-4 py-3">
                          <p className="text-sm font-medium text-[#111217]">{title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#111217]/45">{issuer}</p>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {visibility.featuredWork ? (
        <section id="projects" className="relative border-b border-[#111217]/8 py-20 md:py-24">
          <div className="site-shell space-y-8">
            <Reveal>
              <div className="max-w-[56rem] space-y-4">
                <SectionEyebrow>{featured.titleLine1}</SectionEyebrow>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] md:text-4xl">
                  {featured.titleLine2}
                </h2>
                <p className="max-w-[52rem] text-[1rem] leading-8 text-[#111217]/68 md:text-[1.04rem]">
                  {featured.description}
                </p>
              </div>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project, index) => {
                const targetHref = project.buttonType === 'caseStudy' ? project.behance : project.live;

                return (
                  <Reveal key={project.id} delayMs={index * 80}>
                    <article className="group overflow-hidden rounded-[28px] border border-[#111217]/8 bg-white shadow-[0_16px_40px_rgba(17,18,23,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(17,18,23,0.1)]">
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#f3eee8]">
                        <img
                          src={project.img}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111217]/8 via-transparent to-transparent" />
                      </div>
                      <div className="space-y-4 p-5 md:p-6">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#111217]">{project.title}</h3>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#111217]/42">{project.tags}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={targetHref}
                            onClick={(event) => handlePlaceholderLinkClick(event, targetHref)}
                            target={isPlaceholderHref(targetHref) ? undefined : '_blank'}
                            rel={isPlaceholderHref(targetHref) ? undefined : 'noopener noreferrer'}
                            className="inline-flex items-center justify-center rounded-full bg-[#111217] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-black"
                          >
                            {project.buttonType === 'caseStudy' ? featured.caseStudyLabel : featured.liveLabel}
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {visibility.testimonialsSection ? (
        <section id="testimonials" className="relative border-b border-[#111217]/8 py-20 md:py-24">
          <div className="site-shell space-y-8">
            <Reveal>
              <div className="max-w-[56rem] space-y-4">
                <SectionEyebrow>{scene05.badge}</SectionEyebrow>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] md:text-4xl">
                  {scene05.storyTitle}
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-5 lg:grid-cols-3">
              {visibleTestimonials.map((testimonial, index) => (
                <Reveal key={testimonial.id} delayMs={index * 80}>
                  <article className="h-full rounded-[26px] border border-[#111217]/8 bg-white p-5 shadow-[0_16px_34px_rgba(17,18,23,0.05)] md:p-6">
                    <div className="flex items-center gap-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="h-14 w-14 rounded-full object-cover" />
                      <div>
                        <p className="text-base font-medium text-[#111217]">{testimonial.name}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#111217]/45">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="mt-5 text-[0.96rem] leading-8 text-[#111217]/72">{testimonial.quote}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="contact" className="relative py-20 md:py-24">
        <div className="site-shell">
          <Reveal>
            <div className="rounded-[32px] border border-[#111217]/8 bg-[#111217] px-6 py-8 text-white shadow-[0_24px_60px_rgba(17,18,23,0.16)] md:px-10 md:py-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-4">
                  <SectionEyebrow className="text-white/55">{scene05.actionLabel}</SectionEyebrow>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                    {scene05.visionTitle}
                  </h2>
                  <p className="max-w-[46rem] text-[0.98rem] leading-8 text-white/72">
                    {scene05.aiText}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <a
                    href={contactHref}
                    onClick={(event) => handlePlaceholderLinkClick(event, contactHref)}
                    target={isPlaceholderHref(contactHref) ? undefined : '_blank'}
                    rel={isPlaceholderHref(contactHref) ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#111217] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f1efe9]"
                  >
                    {persistentUI.letsTalkLabel}
                  </a>
                  <a href="#about" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/8">
                    {aboutNavLabel}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default StaticHomeLayout;
