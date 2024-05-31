import "@/styles/globals.css"

import type { AppProps } from 'next/app'
import { ChakraProvider} from '@chakra-ui/provider'
import { theme } from '@/styles/globals'
import { SessionProvider } from "next-auth/react"
import { createStandaloneToast } from '@chakra-ui/toast';
import { Analytics } from "@vercel/analytics/react"
import { Syne, Comfortaa } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
})

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
})



export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { ToastContainer } = createStandaloneToast();
  return (
    <SessionProvider session={session}>
      <Analytics/>
      <ToastContainer />
      <ChakraProvider theme={theme} >
        <div className={`${comfortaa.className} ${syne.className}`}>

        <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </SessionProvider>
  )
}
