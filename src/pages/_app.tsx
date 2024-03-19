import type { AppProps } from 'next/app'
import { ChakraProvider} from '@chakra-ui/provider'
import { theme } from '@/styles/globals'
import { SessionProvider } from "next-auth/react"
import { createStandaloneToast } from '@chakra-ui/toast';
import { Analytics } from "@vercel/analytics/react"




export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { ToastContainer } = createStandaloneToast();
  return (
    <SessionProvider session={session}>
      <Analytics/>
      <ToastContainer />
      <ChakraProvider theme={theme} >
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}
