import type { Metadata } from 'next';
import { Space_Grotesk, Sora } from 'next/font/google';
import './globals.css';

const titleFont = Sora({
  subsets: ['latin'],
  variable: '--font-title'
});

const bodyFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'Pradip Bathwar | Enterprise Frontend Developer (Next.js, React, Webflow, GSAP)',
  description:
    'Pradip Bathwar is an enterprise frontend developer building high-performance web platforms with Next.js, React, Webflow, GSAP, and Three.js.',
  keywords: [
    'Pradip Bathwar',
    'Frontend Developer',
    'Enterprise Frontend Developer',
    'Next.js Developer',
    'React Developer',
    'Webflow Developer',
    'GSAP Animation Developer',
    'Three.js Developer',
    'UI UX Developer',
    'High Performance Websites'
  ],
  openGraph: {
    title: 'Pradip Bathwar | Enterprise Frontend Developer',
    description:
      'High-performance web platforms with Next.js, React, Webflow, GSAP, and Three.js for SaaS and technology companies.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pradip Bathwar | Enterprise Frontend Developer',
    description:
      'Building enterprise-grade frontend experiences with performance, motion, and product-level quality.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const stored = localStorage.getItem('site-theme');
                const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Pradip Bathwar',
              jobTitle: 'Enterprise Frontend Developer',
              email: 'pradipbathwar@gmail.com',
              url: 'https://github.com/code-dev-pradip',
              sameAs: [
                'https://www.linkedin.com/in/pradip-bathwar-21023a242',
                'https://dribbble.com/pradipbathwar',
                'https://github.com/code-dev-pradip'
              ],
              knowsAbout: ['Next.js', 'React', 'Webflow', 'GSAP', 'Three.js', 'Frontend Architecture']
            })
          }}
        />
      </head>
      <body className={`${titleFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
