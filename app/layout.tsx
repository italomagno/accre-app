import './globals.css';

import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import {Logo} from 'components/icons';
import { User } from './user';

import { NavMenu } from './NavMenu';
import { TriggerButton } from './TriggerButton';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ToggleThemeProviderButton } from '@/components/theme/toggleThemeProviderButton';

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
      <body className='w-full'>
  <ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-[60px] items-center border-b px-5">
                <Link
                  className="flex items-center gap-2 font-semibold"
                  href="/"
                >
                  <Logo
                  />
                  <span className="">Shift-App</span>
                </Link>
              </div>
              <NavMenu/>
            </div>
          </div>
          <div className="flex flex-col">
            {/* 
            class="fixed  z-50      bg-zinc-900/0 "
            */}
            <header>
              <div className=" flex h-14 lg:h-[60px] duration-200 inset-x-0  border-b top-0 items-center gap-4   px-6 dark:bg-gray-800/40 justify-between lg:justify-end ">
              <div className='hidden lg:block'>
              <ToggleThemeProviderButton />
              </div>

            <div className='flex gap-2 items-center justify-center lg:hidden'>                    
                    <Logo />
                    <span className="">Shift-App</span></div>
            <div> 
              <div className='flex gap-2 items-center justify-center lg:hidden'>

              <User />
              <ToggleThemeProviderButton />

            <TriggerButton 
              children={
                <NavMenu/>
              }
              />
                </div> 
            </div>
              </div>
            </header>
            {children}
          </div>
        </div>
          </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
