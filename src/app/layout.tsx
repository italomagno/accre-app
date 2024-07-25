import "../styles/globals.css";
import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@/src/components/theme/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { CookiesProvider } from 'next-client-cookies/server';


export const metadata = {
  title: {
    template: '%s | Shift-App ',
    default: 'Shift-App ',
  },
  description:
    'O Shift-App é uma solução inovadora para gerenciar turnos, oferecendo ferramentas avançadas para escalantes e dados essenciais para chefias de órgãos, tudo em um só lugar. Configurado com Next.js,TypeScript, MongoDb e Prisma.'
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
    <CookiesProvider>
    {children}
    </CookiesProvider>
    <Toaster />
  </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
