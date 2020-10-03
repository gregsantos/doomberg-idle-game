import * as React from 'react'
import { Flex, Box, Grid } from '@chakra-ui/core'
import Newsbar from 'components/Newsbar'

export const GridWrapper = (props) => {
  const scrollRef = React.useRef()

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [])

  return (
    <Flex
      ref={scrollRef}
      direction='column'
      h='100vh'
      w='100vw'
      overflow='hidden'
      overflowY='scroll'
    >
      <Box flex={1} pt={['0px', null, '72px', '72px']}>
        {props.children}
      </Box>
      <Box>
        <Newsbar />
      </Box>
    </Flex>
  )
}

export default function RespGrid() {
  return (
    <GridWrapper>
      <Grid
        h='100%'
        w='100%'
        backgroundColor='green.200'
        // gridAutoRows='minmax(100px, auto)'
        // templateRows='75px 1fr auto'
        templateColumns={[
          '1fr 1fr',
          null,
          null,
          'minmax(100px, 1fr) minmax(640px, 1fr) minmax(100px, 1fr)',
        ]}
        templateAreas={[
          `
          "i1 i2"
          "m1 m1"
          "m2 m2"
          "i3 i4"
          `,
          null,
          `
          "i1 i2"
          "m1 m2"
          "m1 m2"
          "i3 i4"
          `,
          `
          "i1 m1 i3"
          "i2 m1 i3"
          "i2 m2 i4"
          `,
        ]}
      >
        <Box gridArea='i1' bg='red.200' />
        <Box gridArea='i2' bg='blue.200' />
        <Box gridArea='m1' bg='red.300' />
        <Box gridArea='m2' bg='blue.300' />
        <Box gridArea='i3' bg='red.400' />
        <Box gridArea='i4' bg='blue.400' />
      </Grid>
    </GridWrapper>
  )
}
