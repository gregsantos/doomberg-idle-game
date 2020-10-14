import React, { useState, useRef } from 'react'
import { Flex, Box, Grid, Button } from '@chakra-ui/core'
import Terminal from 'react-console-emulator'
import { Map } from 'immutable'
import { add, sum, buy, cost, inTheBlack, effects } from 'merchant.js'
import Logo from 'components/Logo'
import Newsbar from 'components/Newsbar'
import Slider from 'components/Slider'
import { useInterval } from 'hooks/useInterval'
import useWindowSize from 'hooks/useWindowSize'
import useLocalStorage from 'hooks/useLocalStorage'
import Counter from 'components/Counter'
import { whole } from 'utils/numbers'
// import onLoad from '../utils/'

// 22645 days, 543480 hrs
// gameTime ~150hrs
const initialTime =
  new Date().setFullYear(new Date().getFullYear() + 62) - Math.floor(Date.now())

const interval = 100
const MULTIPLIER = 1.15
// Currencies
const DOLLARS = 'DOLLARS'

// Items
const pouch = {
  chair: {
    type: 'Chair',
    cost: (state) => {
      if (state.chairs === 0) return Map({ [DOLLARS]: -10 })
      return Map({ [DOLLARS]: -(10 * (state.chairs * MULTIPLIER)) })
    },
    effect: () => {
      return Map({ [DOLLARS]: 0.1 })
    },
  },
}

type Ledger = Map<string, number>

export const GridWrapper = (props) => {
  const { width, height } = useWindowSize()

  return (
    <Flex direction='column' h={height} w={width} maxHeight={height}>
      <Flex
        height={['0px', '60px']}
        display={['flex']}
        direction='column'
        align='center'
        justify='center'
        p={2}
      >
        <Logo width='25' height='25' />
        <h3>D00MBER6</h3>
      </Flex>
      <Box flex={1} overflow='auto'>
        {props.children}
      </Box>
      <Newsbar />
    </Flex>
  )
}

export default function Index() {
  const [wallet, setWallet] = useState<Ledger>(Map())
  const [ledger, setLedger] = useState<Ledger>(Map())
  const [state, setState] = useState({
    count: initialTime,
    name: 'kiddo',
    netWorth: 0,
    payRate: 10,
    chairs: 0,
  })
  const [, setSavedGame] = useLocalStorage<any>('savedGame', state)
  const terminal: { current?: any } = useRef()

  useInterval(() => {
    update()
  }, interval)

  useInterval(() => {
    setSavedGame(state)
  }, interval * 300)

  const update = () => {
    if (state.count === 0) {
      alert(`YOU DIED with $ ${state.netWorth}`)
      return
    }
    setWallet(sum(wallet, ledger))
    setState({
      ...state,
      count: state.count - (3600 * 1000) / 10,
      // count: state.count - (3600 / 60) * 1000,
      netWorth: whole(sum(wallet, ledger).get(DOLLARS)) || 0,
    })
  }

  const work = () => {
    const newWallet = sum(wallet, Map({ [DOLLARS]: state.payRate * 1 }))
    setWallet(newWallet)
    setState({
      ...state,
      count: (state.count / 1000 - 3600 * 8) * 1000,
      netWorth: whole(newWallet.get(DOLLARS)) || 0,
    })
    terminal.current.pushToStdout('You worked 8 hours and earned $10')
  }

  const buyChair = () => {
    const walletWithCostsApplied = buy(pouch.chair, wallet, state)
    if (!inTheBlack(walletWithCostsApplied)) {
      alert("You can't afford this upgrade")
      return
    }

    const newWallet = add(pouch.chair, walletWithCostsApplied)
    setWallet(newWallet)

    const newLedger = effects(Object.values(pouch), newWallet)
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
  return (
    <GridWrapper>
      <Grid
        h='100%'
        templateRows={[
          'minmax(auto, 1fr) 300px 300px',
          '380px minmax(auto, 1fr)',
        ]}
        templateColumns={[
          'repeat(2, 1fr)',
          'repeat(2, 1fr) minmax(200px, 1fr)',
          'repeat(3, 1fr)',
          '1fr 600px 1fr',
        ]}
        templateAreas={[
          `
          "i1 i3"
          "m1 m1"
          "i4 i4"       
          `,
          `
          "m1 m1 m1"
          "i1 i3 i4"
          `,
          null,
          `
          "i1 m1 i4"
          "i1 i3 i4"
          `,
        ]}
      >
        <Flex
          gridArea='i1'
          direction='column'
          p={[1, 2, null, 3]}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Box color='green.300'>Net Worth</Box>
          <Box mb={[1, 2, null, 3]}>$ {whole(wallet.get(DOLLARS)) || 0}</Box>
          <Flex direction='column' mb={[1, 2, null, 3]}>
            <Box color='green.300'>Time till Death</Box>
            <Counter timeLeft={state.count} />
          </Flex>
          <Box>Dollars per second: {whole(getDps())}</Box>
        </Flex>
        <Box gridArea='m1' p={3} border='1px solid' borderColor='green.300'>
          <Terminal
            ref={terminal}
            autoFocus
            ignoreCommandCase
            noEchoBack
            promptLabel={'$'}
            welcomeMessage={`Hey Kiddo I hope you like your present.
          You better, these things ain't cheap!
          `}
            style={{
              height: '100%',
              minHeight: '0px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }}
            contentStyle={{ zIndex: 2, position: 'relative' }}
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
        </Box>
        <Flex
          gridArea='i3'
          direction='column'
          padding={[1, 2, null, 3]}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Button
            mb={[1, 2, null, 3]}
            onClick={work}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            Work
          </Button>
          <Slider id='Leverage' />
        </Flex>
        <Flex
          gridArea='i4'
          minHeight='0'
          minWidth='0'
          direction='column'
          padding={[1, 2, null, 3]}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
          overflow='auto'
        >
          <Button
            mb={[1, 2, null, 3]}
            onClick={buyChair}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            {`Buy a Chair ${cost(pouch.chair, state).get(DOLLARS)}`}
          </Button>
          {['Shop', 'Office', 'Seat', 'Fund'].map((upgrade) => (
            <Button
              size='md'
              mb={[1, 2, null, 3]}
              onClick={buyChair}
              variantColor='green'
              variant='outline'
              zIndex={100}
              _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
              isDisabled={true}
            >
              {`Buy a ${upgrade} ${cost(pouch.chair, state).get(DOLLARS)}`}
            </Button>
          ))}
        </Flex>
      </Grid>
    </GridWrapper>
  )
}
