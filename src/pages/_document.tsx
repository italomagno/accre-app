// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='pt'  >
      <Head >
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9446204860071784"
     crossOrigin="anonymous"></script>
     <meta name="google-adsense-account" content="ca-pub-9446204860071784"></meta>
      </Head>
      <body >
        {/* 👇 Here's the script */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}