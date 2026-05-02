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
  title: 'Pradip Bathwar | Webflow Developer & Product Designer',
  description:
    'Portfolio of Pradip Bathwar - Senior Webflow Developer, UI/UX Designer, and 3D web experience builder.'
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
      </head>
      <body className={`${titleFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
