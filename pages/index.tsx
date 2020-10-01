import React, { useState, useRef } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/core'
import Terminal from 'react-console-emulator'
import { Map } from 'immutable'
import { add, sum, buy, cost, inTheBlack, effects } from 'merchant.js'
import Logo from 'components/Logo'
import Newsbar from 'components/Newsbar'
import { useInterval } from 'hooks/useInterval'
import useLocalStorage from 'hooks/useLocalStorage'
import Counter from 'components/Counter'
import { whole } from 'utils/numbers'
// import onLoad from '../utils/'

// 22645 days, 543480 hrs
// gameTime ~150hrs
const initialTime =
  new Date().setFullYear(new Date().getFullYear() + 62) - Math.floor(Date.now())

const interval = 100

// Currencies
const DOLLARS = 'DOLLARS'

// Items
const pouch = {
  chair: {
    type: 'Chair',
    cost: (state) => {
      return Map({ [DOLLARS]: -10 * ((state.chairs || 1) * 1.15) })
    },
    effect: () => {
      return Map({ [DOLLARS]: 0.1 })
    },
  },
}

type Ledger = Map<string, number>

export const Index = () => {
  const [wallet, setWallet] = useState<Ledger>(Map())
  const [ledger, setLedger] = useState<Ledger>(Map())

  const [state, setState] = useState({
    count: initialTime,
    name: 'kiddo',
    netWorth: 0,
    payRate: 10,
    chairs: 0,
  })

  const [savedGame, setSavedGame] = useLocalStorage<any>('name', state)
  useInterval(() => {
    update()
  }, interval)

  const terminal: { current?: any } = useRef()

  const update = () => {
    setWallet(sum(wallet, ledger))
    setState({
      ...state,
      count: state.count - (3600 * 1000) / 10,
      // count: state.count - (3600 / 60) * 1000,
      netWorth: sum(wallet, ledger).get(DOLLARS) || 0,
    })
  }

  const work = () => {
    const newWallet = sum(wallet, Map({ [DOLLARS]: state.payRate * 1 }))
    setWallet(newWallet)
    setState({
      ...state,
      count: (state.count / 1000 - 3600 * 8) * 1000,
      netWorth: newWallet.get(DOLLARS) || 0,
    })
    terminal.current.pushToStdout('You worked 8 hours and earned $10')
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
    setState({
      ...state,
      chairs: state.chairs + 1,
    })
  }

  const getDps = () => {
    const ledgersTotals = ledger.get(DOLLARS) || 0
    return ledgersTotals * 10
  }

  const saveGame = () => {
    console.log(savedGame)
    setSavedGame(state)
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
        <Button zIndex={100} onClick={saveGame}>
          Save Game
        </Button>
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
          <Box mb={2}>$ {whole(wallet.get(DOLLARS)) || 0}</Box>
          <Box color='green.300'>Time till Death</Box>
          <Counter timeLeft={state.count} />
          <Button
            my={2}
            onClick={work}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
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
          <Box mb={2}>Dollars per second: {whole(getDps())}</Box>
          <Button
            mb={3}
            onClick={buyChair}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            {`Buy a Chair ${cost(pouch.chair, state).get(DOLLARS)}`}
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
          ref={terminal}
          autoFocus
          noAutoScroll
          ignoreCommandCase
          noEchoBack
          promptLabel={'$'}
          welcomeMessage={`Hey Kiddo I hope you like your present.
          You better, these things ain't cheap!
          `}
          style={{
            height: '75%',
            width: '100%',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            zIndex: 120,
          }}
          contentStyle={{ overflow: 'auto' }}
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
