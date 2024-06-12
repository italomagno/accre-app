import './globals.css';

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@/src/components/theme/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { LayoutComponent } from './LayoutComponent';


export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="pt" >
      <body >

  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
      {children}
    
    <Toaster />
  </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
