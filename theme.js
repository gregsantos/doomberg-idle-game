import { theme } from '@chakra-ui/core'

export default {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      green: '#41FF00',
      green2: '#5bf870',
      test: 'red',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
  fonts: {
    heading: 'Avenir Next, sans-serif',
    body: 'VT323, monospace',
    mono: 'VT323, monospace',
  },
}
