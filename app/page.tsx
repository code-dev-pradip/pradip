import KentoBackground from './kento-background';
import NonlinearPortfolioCanvas from './nonlinear-portfolio-canvas';
import RevealAnimations from './reveal-animations';
import ThemeToggle from './theme-toggle';
import {
  certifications,
  experience,
  profile,
  projects,
  skills,
  socials,
  tools
} from './portfolio-data';

export default function HomePage() {
  return (
    <main>
      <KentoBackground />
      <RevealAnimations />
      <div className="grain" />

      <header className="floating-center-nav" aria-label="Primary">
        <a className="floating-center-nav-brand" href="#home" aria-label="Back to top">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4h6.2c3.3 0 5.8 2.2 5.8 5.4s-2.5 5.5-5.8 5.5H9.4V20H7V4Z" />
            <path d="M9.4 12.8h3.6c1.9 0 3.4-1.3 3.4-3.3S14.9 6.2 13 6.2H9.4v6.6Z" />
          </svg>
        </a>
        <nav>
          <a href="#projects">Projects</a>
          <a href="#about">About Me</a>
          <a href="#contact">Contact</a>
        </nav>
        <ThemeToggle />
      </header>

      <NonlinearPortfolioCanvas
        profile={profile}
        projects={projects}
        tools={tools}
        skills={skills}
        experience={experience}
        certifications={certifications}
        socials={socials}
      />
    </main>
  );
}
