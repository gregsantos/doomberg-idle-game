import React, { useState, useRef } from 'react'
import { Flex, Box, Grid, Text, Button } from '@chakra-ui/core'
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
  return (
    <Flex direction='column' h='100vh'>
      <Flex
        flexBasis='30px'
        display={['none', 'flex']}
        direction='column'
        align='center'
        justify='center'
        p={2}
      >
        <Logo width='25' height='25' />
        <h3>DOOMBERG</h3>
      </Flex>
      <Box flex='1' overflow='scroll'>
        {props.children}
      </Box>
      <Newsbar />
    </Flex>
  )
}

export default function RespGrid() {
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
        height='100%'
        templateRows={[
          'minmax(mincontent, 60%) 1fr',
          '1fr 240px 240px',
          '240px 240px 1fr',
          '240px 240px 1fr',
        ]}
        templateColumns={['repeat(2, 1fr)', null, null, '1fr 600px 1fr']}
        templateAreas={[
          `
          "i1 i1"
          "m1 m1"
          "i3 i4"       
          `,
          `
          "i1 i3 i4"
          "m1 m1 i4"
          "m1 m1 i4"       
          `,
          `
          "i1 m1"
          "i4 m1"
          "i4 i3"
          `,
          `
          "i1 m1 i4"
          "i1 m1 i4"
          "i3 i3 i3"
          `,
        ]}
      >
        <Flex
          gridArea='i1'
          direction='column'
          justify='flex-start'
          padding={3}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Box color='green.300'>Time till Death</Box>
          <Counter timeLeft={state.count} />
          <Box mt={2} color='green.300'>
            Net Worth
          </Box>
          <Box mb={2}>$ {whole(wallet.get(DOLLARS)) || 0}</Box>
          <Box mb={2}>Dollars per second: {whole(getDps())}</Box>
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
        <Box
          gridArea='m1'
          minHeight='0'
          minWidth='0'
          p={3}
          border='1px solid'
          borderColor='green.300'
        >
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
              zIndex: 120,
            }}
            contentStyle={{ overflow: 'scroll' }}
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
          align='center'
          padding={2}
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
        <Flex
          gridArea='i4'
          direction='column'
          justify='space-evenly'
          padding={[1, 2, null, 3]}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
          overflowY='auto'
        >
          <Button
            mb={[1]}
            onClick={buyChair}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            {`Buy a Chair ${cost(pouch.chair, state).get(DOLLARS)}`}
          </Button>
          <Button
            mb={[1]}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            A
          </Button>
          <Button
            mb={1}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            A
          </Button>
          <Button
            mb={1}
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            A
          </Button>
          <Button
            variantColor='green'
            variant='outline'
            zIndex={100}
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          >
            A
          </Button>
        </Flex>
      </Grid>
    </GridWrapper>
  )
}
