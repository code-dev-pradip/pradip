import NonlinearPortfolioCanvas from './nonlinear-portfolio-canvas';
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
