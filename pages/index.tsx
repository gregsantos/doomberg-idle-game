import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/core'
import Terminal from 'react-console-emulator'
import Logo from '../components/Logo'
import Newsbar from '../components/Newsbar'
import { useInterval } from '../hooks/useInterval'
import Counter from '../components/Counter'
// import onLoad from '../utils/'

type IndexProps = { name: string }

const diff =
  new Date().setFullYear(new Date().getFullYear() + 62) - Math.floor(Date.now())

const initialTime = diff
const interval = 100

// const showMsg = () => 'Hello World'

export const Index = ({ name = 'kiddo' }: IndexProps) => {
  //   const [response, setResponse] = useState<null | { price: number }>(null);
  const [state, setState] = useState({
    netWorth: 0,
    count: initialTime,
    payRate: 10,
  })

  useEffect(() => {
    // onLoad()
  }, [])

  useInterval(() => {
    setState({ ...state, count: state.count - (3600 / 60) * 1000 })
  }, interval)

  const click = () => {
    setState({
      ...state,
      netWorth: state.netWorth + state.payRate * 1,
      count: (state.count / 1000 - 3600 * 8) * 1000,
    })
  }

  return (
    <Box
      display={{ base: 'flex', md: 'grid' }}
      flexDirection='column'
      gridTemplateColumns='minmax(245px, 1fr) 2fr minmax(245px, 1fr)'
      gridTemplateRows='auto 1fr auto'
      minHeight='100vh'
    >
      <header>
        <Flex p={3} direction='column' align='center'>
          <Logo width='50' height='25' />
          <h1>DOOMBERG</h1>
          <h3>{name}</h3>
        </Flex>
      </header>
      <Box p={3} border='1px solid' borderColor='green.300'>
        <Flex
          direction='column'
          justify='center'
          padding='20px'
          color='green.300'
          border='1px solid'
          borderColor='green.300'
          zIndex={100}
        >
          <Box color='green.300'>Net Worth</Box>
          <Box>$ {state.netWorth}</Box>
          <Box color='green.300'>Time till Death</Box>
          <Counter timeLeft={state.count} />
        </Flex>
      </Box>
      <Flex
        flex={1}
        p={3}
        justify='center'
        align='center'
        border='1px solid'
        borderColor='green.300'
      >
        <Terminal
          autoFocus
          welcomeMessage={'Welcome to the Doomberg terminal!'}
          promptLabel={'me@DOOMBERG:~$'}
          style={{
            height: '100%',
            width: '100%',
            alignSelf: 'flex-start',
            minHeight: '50px',
          }}
          commandCallback={(result) => console.log(result)}
          commands={{
            echo: {
              description: 'Echo a passed string.',
              usage: 'echo <string>',
              fn: function () {
                return `${Array.from(arguments).join(' ')}`
              },
            },
          }}
        />
      </Flex>
      <Box p={3} border='1px solid' borderColor='green.300'>
        <Flex
          direction='column'
          justify='center'
          padding={3}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Button
            mb={3}
            onClick={click}
            variantColor='green'
            variant='outline'
            zIndex={100}
          >
            Work
          </Button>
          <Flex id='slider' align='center' direction={['row', 'row', 'column']}>
            <Flex align='center' m={2} zIndex={100}>
              <Text fontSize='sm' mr={2}>
                Leverage
              </Text>
              <label className='switch'>
                <input type='checkbox' />
                <span className='slider'></span>
              </label>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <footer>
        <Newsbar />
      </footer>
      <div id='screen' />
      <div id='scanline' />
      <div id='interlace' />
      <div id='green-light' />
    </Box>
  )
}

export default Index
