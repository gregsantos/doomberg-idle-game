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
import { DOLLARS, INITIAL_TIME, INTERVAL } from 'utils/constants'
import { pouch } from 'utils/wallet'
import { Ledger } from 'interfaces'
// import onLoad from '../utils/'

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
    count: INITIAL_TIME,
    name: 'kiddo',
    netWorth: 0,
    payRate: 10,
    chairs: 0,
    floors: 0,
    buildings: 0,
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
      <Grid
        h='100%'
        templateRows={[
          'minmax(auto, 1fr) 300px auto 200px',
          '450px minmax(auto, 1fr)',
        ]}
        templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
        templateAreas={[
          `
          "i1 i1"
          "m1 m1"
          "i2 i2"
          "i3 i4"       
          `,
          `
          "m1 m1 i1"
          "i3 i4 i2"
          `,
        ]}
      >
        <Grid
          gridArea='i1'
          gridTemplateColumns={['repeat(2, 1fr)', '1fr']}
          gridGap='1'
          p={[1, 1, 2]}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
        >
          <Flex direction='column' justify='center'>
            <Flex direction='column' align='center'>
              <Box color='green.300'>Net Worth</Box>
              <Box>$ {whole(wallet.get(DOLLARS)) || 0}</Box>
            </Flex>
            <Flex direction='column' align='center'>
              <Box>$ per second</Box>
              <Box>{whole(getDps())}</Box>
            </Flex>
          </Flex>
          <Flex
            direction='column'
            align='center'
            justify='center'
            p={[1, 1, 2]}
            color='green.300'
            border='1px solid'
            borderColor='green.300'
          >
            <Box color='green.300'>Time till Death</Box>
            <Counter timeLeft={state.count} />
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
          gridArea='i2'
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
          gridArea='i3'
          minHeight='0'
          minWidth='0'
          direction='column'
          padding={[1, 2, null, 3]}
          color='green.300'
          border='1px solid'
          borderColor='green.300'
          overflow='auto'
        >
          {['chair', 'floor', 'building'].map((upgrade) => (
            <Button
              id={upgrade}
              mb={[1, 2, null, 3]}
              onClick={buyBuilding}
              variantColor='green'
              variant='outline'
              zIndex={100}
              _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
              isDisabled={false}
            >
              {`Buy a ${upgrade} ${whole(
                cost(pouch[upgrade], state).get(DOLLARS)
              )}`}
            </Button>
          ))}
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
          {['chair', 'floor', 'building'].map((upgrade) => (
            <Button
              id={upgrade}
              mb={[1, 2, null, 3]}
              onClick={buyBuilding}
              variantColor='green'
              variant='outline'
              zIndex={100}
              _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
              isDisabled={true}
            >
              {`Buy a ${upgrade} ${whole(
                cost(pouch[upgrade], state).get(DOLLARS)
              )}`}
            </Button>
          ))}
        </Flex>
      </Grid>
    </GridWrapper>
  )
}
