'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import DraggableProjectBoard from './draggable-project-board';
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

export default function NonlinearPortfolioCanvas({
  profile,
  projects,
  tools,
  skills,
  experience,
  certifications,
  socials
}: Props) {
  useEffect(() => {
    const onNavClick = (event: Event) => {
      const trigger = event.target as HTMLElement | null;
      const link = trigger?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', onNavClick);
    return () => document.removeEventListener('click', onNavClick);
  }, []);

  return (
    <section className="portfolio-canvas-shell" aria-label="Non linear portfolio canvas">
      <div className="canvas-viewport">
        <div className="canvas-world">
          <article className="node-hero" id="home">
            <div className="hero-spotlight" aria-hidden="true" />
            <p className="canvas-eyebrow">Frontend Developer • Freelance Webflow + Next.js</p>
            <h1 className="canvas-title">I craft high-performance websites with premium interaction and motion.</h1>
            <p className="canvas-copy">
              Freelancer building conversion-ready experiences with Webflow, Next.js, Three.js, GSAP, and custom
              animation systems.
            </p>
            <div className="hero-skill-row">
              <span>Webflow</span>
              <span>Next.js</span>
              <span>Three.js</span>
              <span>GSAP</span>
              <span>Custom Animation</span>
              <span>{profile.yearsExperience}</span>
            </div>
          </article>

          <article className="node-projects" id="projects">
            <div className="node-projects-sticky">
              <DraggableProjectBoard projects={projects} />
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
            <p className="canvas-eyebrow">Capabilities & Experience</p>
            <h2>Frontend delivery with motion, polish, and performance.</h2>
            <ul className="canvas-chip-list wide">
              {[...tools, ...skills].slice(0, 14).map((item) => (
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
                <Image key={image} src={image} alt={`Certificate ${idx + 1}`} width={320} height={220} />
              ))}
            </div>
          </article>

          <article className="canvas-card node-contact" id="contact">
            <p className="canvas-eyebrow">Contact</p>
            <h2>Let&apos;s build your next digital experience.</h2>
            <p className="canvas-copy">
              Available for product design, Webflow development, and interaction-heavy front-end projects.
            </p>
            <div className="canvas-contact-actions">
              <a className="btn primary" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="btn ghost" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                {profile.phone}
              </a>
            </div>
            <ul className="canvas-socials">
              {socials.map((social) => (
                <li key={social.name}>
                  <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                    <Image src={social.icon} alt={social.name} width={36} height={36} />
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
