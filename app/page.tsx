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
