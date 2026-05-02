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

      <div className="top-theme-button">
        <ThemeToggle />
      </div>

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
