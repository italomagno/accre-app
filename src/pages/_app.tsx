import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/styles/globals'
import { SessionProvider } from "next-auth/react"



export default function App({ Component, pageProps:{session,...pageProps} }: AppProps) {
  return (
<SessionProvider session={session}>
<ChakraProvider theme={theme} >
    <Component {...pageProps} />
    </ChakraProvider>
    </SessionProvider>
  )
}
