import React, { useState } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/core'
import Terminal from 'react-console-emulator'
import { Map } from 'immutable'
import { add, sum, buy, inTheBlack, effects } from 'merchant.js'
import Logo from '../components/Logo'
import Newsbar from '../components/Newsbar'
import { useInterval } from '../hooks/useInterval'
import Counter from '../components/Counter'
// import onLoad from '../utils/'

const initialTime =
  new Date().setFullYear(new Date().getFullYear() + 62) - Math.floor(Date.now())

const interval = 100

// Currencies
const DOLLARS = 'DOLLARS'

// Items
const pouch = {
  chair: {
    type: 'Chair',
    cost: () => {
      return Map({ [DOLLARS]: -10 })
    },
    effect: () => {
      return Map({ [DOLLARS]: 1 })
    },
  },
}

type IndexProps = { name: string }

export const Index = ({ name = 'anonymous' }: IndexProps) => {
  const [wallet, setWallet] = useState(Map())
  const [ledger, setLedger] = useState(Map())

  const [state, setState] = useState({
    netWorth: 0,
    count: initialTime,
    payRate: 10,
  })

  useInterval(() => {
    update()
  }, interval)

  const update = () => {
    setWallet(sum(wallet, ledger))
    setState({
      ...state,
      count: state.count - (3600 / 60) * 1000,
    })
  }

  const work = () => {
    const newWallet = sum(wallet, Map({ [DOLLARS]: 1 }))
    setWallet(newWallet)
  }

  const buyChair = () => {
    const walletWithCostsApplied = buy(pouch.chair, wallet)
    if (!inTheBlack(walletWithCostsApplied)) {
      alert("You can't afford this upgrade")
      return
    }

    const newWallet = add(pouch.chair, walletWithCostsApplied)
    const newLedger = effects(Object.values(pouch), newWallet)

    setWallet(newWallet)
    setLedger(newLedger)
  }

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
      gridTemplateColumns='minmax(100px, 1fr) 640px minmax(100px, 1fr)'
      gridTemplateRows='75px 1fr auto'
      minHeight='100vh'
    >
      <header>
        <Logo width='25' height='25' />
        <h3>DOOMBERG</h3>
      </header>
      <Box p={3} border='1px solid' borderColor='green.300'>
        <Flex
          direction='column'
          justify='center'
          padding={3}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Box color='green.300'>Net Worth</Box>
          <Box mb={2}>$ {wallet.get(DOLLARS) || 0}</Box>
          <Box color='green.300'>Time till Death</Box>
          <Counter timeLeft={state.count} />
          <Button
            my={2}
            onClick={work}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'green.200' }}
          >
            Work
          </Button>
        </Flex>
        <Flex
          direction='column'
          justify='center'
          mt={3}
          padding={3}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Box mb={2}>Dollars per second: {ledger.get(DOLLARS) || 0 / 5}</Box>
          <Button
            mb={3}
            onClick={buyChair}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'green.200' }}
          >
            Buy a Chair
          </Button>
          <h1> Chairs: {wallet.get(pouch.chair.type) || 0} </h1>
        </Flex>
      </Box>
      <Flex
        flex={1}
        p={3}
        justify='center'
        align='center'
        direction='column'
        border='1px solid'
        borderColor='green.300'
      >
        <Terminal
          autoFocus
          ignoreCommandCase
          promptLabel={'$'}
          welcomeMessage={'Welcome to the Doomberg terminal!'}
          style={{
            height: '75%',
            width: '100%',
            alignSelf: 'flex-start',
          }}
          contentStyle={{ overflow: 'scroll', maxHeight: '192px' }}
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
        <Flex
          flex={1}
          width='100%'
          mt={3}
          p={3}
          justify='center'
          align='center'
          border='1px solid'
          borderColor='green.300'
        ></Flex>
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
