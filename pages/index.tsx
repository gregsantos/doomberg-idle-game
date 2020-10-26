import React, { useState, useRef } from 'react'
import { Flex, Box, Grid, Button } from '@chakra-ui/core'
import Terminal from 'react-console-emulator'
import { Map } from 'immutable'
import { add, sum, buy, inTheBlack, effects } from 'merchant.js'
import Logo from 'components/Logo'
import Newsbar from 'components/Newsbar'
import ButtonGroup from 'components/ButtonGroup'
import { useInterval } from 'hooks/useInterval'
import useWindowSize from 'hooks/useWindowSize'
import useLocalStorage from 'hooks/useLocalStorage'
import Counter from 'components/Counter'
import { whole } from 'utils/numbers'
import { DOLLARS, INITIAL_TIME, INTERVAL } from 'utils/constants'
import { pouch } from 'utils/wallet'
import { Ledger } from 'interfaces'

export const GridWrapper = (props) => {
  const { width, height } = useWindowSize()

  return (
    <Flex direction='column' h={height} w={width} maxHeight={height}>
      <div id='screen' />
      <div id='scanline' />
      <div id='interlace' />
      <div id='green-light' />
      <Flex
        height={['0px', '40px', '50px', '60px']}
        direction='column'
        align='center'
        justify='center'
        p={2}
      >
        <Logo width='25' height='25' />
        <h3>D00MBER6</h3>
      </Flex>
      <Flex flex={1} overflow='auto'>
        {props.children}
      </Flex>
      <Newsbar />
    </Flex>
  )
}

export default function Index() {
  const [wallet, setWallet] = useState<Ledger>(Map())
  const [ledger, setLedger] = useState<Ledger>(Map())
  const [state, setState] = useState({
    count: INITIAL_TIME,
    name: 'kiddo',
    netWorth: 0,
    occupation: 'Shoe Shine',
    payRate: 10,
    chairs: 0,
    floors: 0,
    buildings: 0,
    blocks: 0,
  })
  const [, setSavedGame] = useLocalStorage<any>('savedGame', state)
  const terminal: { current?: any } = useRef()

  useInterval(() => {
    update()
  }, INTERVAL)

  useInterval(() => {
    setSavedGame(state)
  }, INTERVAL * 300)

  const update = () => {
    if (state.count === 0) {
      alert(`YOU DIED with $ ${state.netWorth}`)
      return
    }
    setWallet(sum(wallet, ledger))
    setState({
      ...state,
      count: state.count - (3600 * 1000) / 10,
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

  const buyBuilding = (e) => {
    const { id } = e.target
    const walletWithCostsApplied = buy(pouch[id], wallet, state)
    if (!inTheBlack(walletWithCostsApplied)) {
      alert("You can't afford this upgrade")
      return
    }

    const newWallet = add(pouch[id], walletWithCostsApplied)
    setWallet(newWallet)

    const newLedger = effects(Object.values(pouch), newWallet)
    setLedger(newLedger)

    setState({
      ...state,
      [`${id}s`]: state[`${id}s`] + 1,
    })
  }

  const getDps = () => {
    const ledgersTotals = ledger.get(DOLLARS) || 0
    return ledgersTotals * 10
  }
  return (
    <GridWrapper>
      <Box flex={1} overflow='auto'>
        <Grid
          minHeight='100%'
          templateRows={[
            'auto 300px auto auto',
            '200px minmax(auto, 1fr) auto',
          ]}
          templateColumns={['repeat(2, 1fr)', 'repeat(4, 1fr)']}
          templateAreas={[
            `
          "i1 i1"
          "m1 m1"
          "b1 b2"
          "b3 b4"       
          `,
            `
          "m1 m1 m1 i1"
          "m1 m1 m1 i1"
          "b1 b2 b3 b4"
          `,
          ]}
        >
          <Grid
            gridArea='i1'
            gridTemplateColumns={['repeat(2, 1fr)', '1fr']}
            gridTemplateRows={['1fr auto', 'auto 1fr']}
            gridGap={['1', '2']}
            p={[1, 1, 2]}
            color='green.300'
            border='1px solid'
            borderColor='green.300'
          >
            <Flex direction='column' p={[1, 2]}>
              <Flex justify='space-between'>
                <Box color='green.300'>Net Worth</Box>
                <Box>$ {whole(wallet.get(DOLLARS)) || 0}</Box>
              </Flex>
              <Flex justify='space-between'>
                <Box color='green.300'>$ per sec</Box>
                <Box>$ {whole(getDps())}</Box>
              </Flex>
            </Flex>
            <Flex
              direction='column'
              align='center'
              justify='center'
              p={[0, 1, 2]}
              color='green.300'
              border='1px solid'
              borderColor='green.300'
            >
              <Box color='green.300'>Time till Death</Box>
              <Counter timeLeft={state.count} />
            </Flex>
            <Flex
              align='center'
              justify='center'
              gridColumn={['1 / span 2', 1]}
            >
              <Button
                flex='1'
                onClick={work}
                variantColor='green'
                variant='outline'
                zIndex={100}
                _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
              >
                Work ({state.occupation})
              </Button>
            </Flex>
          </Grid>
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
            gridArea='b1'
            minHeight='0'
            minWidth='0'
            direction='column'
            justify='center'
            padding={[1, 2, null, 3]}
            color='green.300'
            border='1px solid'
            borderColor='green.300'
            overflow='auto'
          >
            <ButtonGroup
              disabled={false}
              gameState={state}
              buyBuilding={buyBuilding}
            />
          </Flex>
          <Flex
            gridArea='b2'
            minHeight='0'
            minWidth='0'
            direction='column'
            justify='center'
            padding={[1, 2, null, 3]}
            color='green.300'
            border='1px solid'
            borderColor='green.300'
            overflow='auto'
          >
            <ButtonGroup disabled gameState={state} buyBuilding={buyBuilding} />
          </Flex>
          <Flex
            gridArea='b3'
            minHeight='0'
            minWidth='0'
            direction='column'
            justify='center'
            padding={[1, 2, null, 3]}
            color='green.300'
            border='1px solid'
            borderColor='green.300'
            overflow='auto'
          >
            <ButtonGroup disabled gameState={state} buyBuilding={buyBuilding} />
          </Flex>
          <Flex
            gridArea='b4'
            minHeight='0'
            minWidth='0'
            direction='column'
            justify='center'
            padding={[1, 2, null, 3]}
            color='green.300'
            border='1px solid'
            borderColor='green.300'
            overflow='auto'
          >
            <ButtonGroup disabled gameState={state} buyBuilding={buyBuilding} />
          </Flex>
        </Grid>
      </Box>
    </GridWrapper>
  )
}
