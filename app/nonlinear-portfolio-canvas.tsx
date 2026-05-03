'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import DraggableProjectBoard from './draggable-project-board';
import EyeFollowButton from './eye-follow-button';
import type { Project } from './portfolio-data';

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  detail: string;
};

type Profile = {
  title: string;
  yearsExperience: string;
  location: string;
  email: string;
  phone: string;
  headline: string;
  about: string;
};

type Social = {
  name: string;
  href: string;
  icon: string;
};

type Props = {
  profile: Profile;
  projects: Project[];
  tools: string[];
  skills: string[];
  experience: ExperienceItem[];
  certifications: string[];
  socials: Social[];
};

type FloatingTechItem = {
  id: string;
  label: string;
};

const FLOATING_TECH: FloatingTechItem[] = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'react', label: 'React' },
  { id: 'webflow', label: 'Webflow' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'notion', label: 'Notion' },
  { id: 'slack', label: 'Slack' },
  { id: 'vscode', label: 'VS Code' },
  { id: 'gsap', label: 'GSAP' },
  { id: 'threejs', label: 'Three.js' }
];

function TechGlyph({ id }: { id: string }) {
  if (id === 'html') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 2h18l-1.7 19L12 23l-7.3-2L3 2Z" />
        <path d="m8.2 7 .3 3.3h7.1l-.3 4.3-3.3 1-3.3-1-.2-2.1" />
      </svg>
    );
  }
  if (id === 'css') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 2h18l-1.6 19L12 23l-7.4-2L3 2Z" />
        <path d="m8 7-.2 2.8h6.4l-.2 2.4H8l-.2 2.7 4.2 1.2 4.2-1.2.7-7.9H8Z" />
      </svg>
    );
  }
  if (id === 'react') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="8.6" ry="3.4" />
        <ellipse cx="12" cy="12" rx="8.6" ry="3.4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="8.6" ry="3.4" transform="rotate(-60 12 12)" />
        <circle cx="12" cy="12" r="1.3" />
      </svg>
    );
  }
  if (id === 'webflow') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 16.7 8.5 7.5h5l-3.7 6 4.1-2.7h5.1L12 20.5H7.5l3.6-5.9-4.2 2.1H3Z" />
      </svg>
    );
  }
  if (id === 'nextjs') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.8" />
        <path d="M8.5 15V9l7 6V9" />
      </svg>
    );
  }
  if (id === 'notion') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="1.6" />
        <path d="M8 16V8l8 8V8" />
      </svg>
    );
  }
  if (id === 'slack') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="10.4" y="2.8" width="3.2" height="7.6" rx="1.6" />
        <rect x="13.6" y="10.4" width="7.6" height="3.2" rx="1.6" />
        <rect x="10.4" y="13.6" width="3.2" height="7.6" rx="1.6" />
        <rect x="2.8" y="10.4" width="7.6" height="3.2" rx="1.6" />
      </svg>
    );
  }
  if (id === 'vscode') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m16.6 4.4 3.1 1.5v12.2l-3.1 1.5-8.7-7.6 8.7-7.6Z" />
        <path d="m4.2 8.3 3-2.2 6.5 5.9-6.5 5.9-3-2.2 4.3-3.7-4.3-3.7Z" />
      </svg>
    );
  }
  if (id === 'gsap') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.2 14.7h5.5l-1.5 6.4 11.6-11.8h-5.6l1.6-6.4L4.2 14.7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.8h14v14H5z" />
      <path d="M8 8h8v8H8z" />
      <path d="M5 4.8 19 19" />
    </svg>
  );
}

function SocialIcon({ name }: { name: string }) {
  const id = name.toLowerCase();

  if (id.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.8 9.4h3.2V20H6.8V9.4Zm1.6-5.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM12 9.4h3v1.5h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.2V20h-3.2v-5c0-1.2 0-2.8-1.8-2.8s-2 1.4-2 2.7V20H12V9.4Z" />
      </svg>
    );
  }

  if (id.includes('dribbble')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M7 18.5c1.2-2.4 3.6-4.2 6.7-4.2 1.2 0 2.3.2 3.3.6" />
        <path d="M6.2 8.6c2.4.3 4.8.2 7-.2 1.5-.3 2.9-.8 4.2-1.6" />
        <path d="M9 4.3c1.8 2.2 3.4 4.7 4.5 7.4.8 1.9 1.4 4 1.7 6.1" />
      </svg>
    );
  }

  if (id.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.8.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.1-4.7-5A4 4 0 0 1 7 8.2c-.1-.3-.5-1.3.1-2.8 0 0 .8-.2 2.9 1.1a10 10 0 0 1 5.2 0c2.1-1.3 2.9-1.1 2.9-1.1.6 1.5.2 2.5.1 2.8a4 4 0 0 1 1 2.7c0 3.9-2.4 4.7-4.7 5 .4.3.8 1 .8 2.1v3.1c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
      </svg>
    );
  }

  if (id.includes('call') || id.includes('phone')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 16.8v2a1.4 1.4 0 0 1-1.5 1.4A16.8 16.8 0 0 1 3.8 5.5 1.4 1.4 0 0 1 5.2 4h2a1.4 1.4 0 0 1 1.4 1.2c.1 1 .4 2 .9 2.9a1.4 1.4 0 0 1-.3 1.7L8.3 10.7a12.4 12.4 0 0 0 5 5l.9-.9a1.4 1.4 0 0 1 1.7-.3c.9.5 1.9.8 2.9.9A1.4 1.4 0 0 1 20 16.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.8" y="5.6" width="18.4" height="12.8" rx="2.2" ry="2.2" />
      <path d="m4.4 7.2 7.6 6 7.6-6" />
    </svg>
  );
}

export default function NonlinearPortfolioCanvas({
  profile,
  projects,
  tools,
  skills,
  experience,
  certifications,
  socials
}: Props) {
  const orbitChips = useMemo(
    () =>
      FLOATING_TECH.map((item, index) => ({
        ...item,
        angle: (360 / FLOATING_TECH.length) * index
      })),
    []
  );

  useEffect(() => {
    const NAV_OFFSET = 40;

    const onNavClick = (event: Event) => {
      const trigger = event.target as HTMLElement | null;
      const link = trigger?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      const scroller = document.querySelector<HTMLElement>('.canvas-viewport');
      if (scroller) {
        const scrollerRect = scroller.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const nextTop = targetRect.top - scrollerRect.top + scroller.scrollTop - NAV_OFFSET;
        scroller.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
        return;
      }

      const nextTop = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    };
    document.addEventListener('click', onNavClick);
    return () => document.removeEventListener('click', onNavClick);
  }, []);

  return (
    <section className="portfolio-canvas-shell" aria-label="Non linear portfolio canvas">
      <div className="canvas-viewport">
        <div className="canvas-world">
          <article className="node-hero" id="home">
            <div className="hero-tech-cloud" aria-hidden="true">
              <div className="hero-tech-orbit hero-tech-orbit-main">
                {orbitChips.map((item) => (
                  <div
                    key={item.id}
                    className="hero-tech-node"
                    style={{ ['--tech-angle-target' as string]: `${item.angle}deg` } as CSSProperties}
                  >
                    <div className="hero-tech-chip">
                      <span className="hero-tech-icon">
                        <TechGlyph id={item.id} />
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="canvas-eyebrow">Frontend Developer</p>
            <h1 className="canvas-title">I Build Motion-Driven Web Experiences</h1>
            <p className="canvas-copy">
              Frontend developer specializing in Next.js, React, Webflow, GSAP, and Three.js for SaaS, AI, and high-growth technology companies.
            </p>
            <EyeFollowButton href={`mailto:${profile.email}`} label="Get in touch" />
          </article>

          <article className="node-projects" id="projects">
            <div className="node-projects-sticky">
              <DraggableProjectBoard projects={projects} visibilityTargetId="projects" />
            </div>
          </article>

          <article className="node-about-free" id="about">
            <div className="about-free-note">
              <span className="about-free-note-pin" aria-hidden="true" />
              <span className="about-free-note-pin" aria-hidden="true" />
              <span className="about-free-note-pin" aria-hidden="true" />
              <p>
                I&apos;m a frontend developer focused on high-quality web experiences. I work with Webflow, Next.js,
                Three.js, GSAP, and custom animation systems to build fast, polished, production-ready websites.
              </p>
            </div>

            <div className="about-free-lines">
              <p>I turn ideas into responsive, interaction-rich interfaces with clean UX and strong performance.</p>
              <p>
                <span>I build with AI</span>, prototyping quickly and pushing the edge of design and technology.
              </p>
            </div>
          </article>

          <article className="canvas-card node-cap-experience" id="experience">
            <p className="canvas-eyebrow">Skills & Experience</p>
            <h2>Frontend delivery with motion, polish, and performance.</h2>
            <ul className="canvas-chip-list wide">
              {[...tools, ...skills].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="canvas-timeline">
              <section>
                <p>{experience[0]?.period ?? 'Sep 2024 - Present'}</p>
                <h3>
                  {experience[0]?.role ?? 'Webflow Developer'} · {experience[0]?.company ?? 'Designing'}
                </h3>
                <p>
                  {experience[0]?.detail ??
                    'Own complete design-to-development delivery for custom components, animation systems, 3D integrations, and production-ready interfaces.'}
                </p>
              </section>
            </div>
          </article>

          <article className="canvas-card node-certs">
            <p className="canvas-eyebrow">Certificates</p>
            <div className="canvas-certs-grid">
              {certifications.map((image, idx) => (
                <Image
                  key={image}
                  src={image}
                  alt={`Certificate ${idx + 1}`}
                  width={320}
                  height={220}
                  priority
                  loading="eager"
                  sizes="(max-width: 640px) 92vw, (max-width: 920px) 46vw, 22vw"
                />
              ))}
            </div>
          </article>

          <article className="canvas-card node-contact" id="contact">
            <p className="canvas-eyebrow">Contact</p>
            <h2>Let&apos;s build your next digital experience.</h2>
            <p className="canvas-copy">
              Available for product design, Webflow development, and interaction-heavy front-end projects.
            </p>
            <ul className="canvas-socials">
              {socials.map((social) => (
                <li key={social.name}>
                  <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                    <SocialIcon name={social.name} />
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
