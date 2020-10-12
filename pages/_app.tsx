import React from 'react'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { AppProps } from 'next/app'
import Head from 'next/head'
import theme from 'theme'
import '../styles/styles.scss'

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Head>
        <title>DOOMBERG</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div id='screen' />
      <div id='scanline' />
      <div id='interlace' />
      <div id='green-light' />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default App
