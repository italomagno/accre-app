// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='pt'  >
      <Head />
      <body >
        {/* 👇 Here's the script */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}