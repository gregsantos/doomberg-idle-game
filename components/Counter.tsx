import React from 'react'
import { Flex, Box, Text } from '@chakra-ui/core'

type CountDownProps = { timeLeft: number }

const CountDown = ({ timeLeft }: CountDownProps) => {
  const getTimeLeft = () => {
    return {
      years: Math.floor(timeLeft / (1000 * 60 * 60 * 24) / 365),
      days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
    }
  }

  return (
    <Flex>
      <Flex
        p='0px 0px 0px 0px'
        direction='column'
        justify='flex-start'
        align='center'
      >
        <Box m='0px'>{getTimeLeft().years || '0'}</Box>
        <Text fontSize='sm'>Years</Text>
      </Flex>
      <Flex
        p='0px 2px 0px 2px'
        direction='column'
        justify='flex-start'
        align='center'
      >
        <Box m='0px'>:</Box>
      </Flex>
      <Flex
        p='0px 0px 0px 0px'
        direction='column'
        justify='flex-start'
        align='center'
      >
        <Box m='0px'>{getTimeLeft().days || '0'}</Box>
        <Text fontSize='sm'>Days</Text>
      </Flex>
      <Flex
        p='0px 2px 0px 2px'
        direction='column'
        justify='flex-start'
        align='center'
      >
        <Box m='0px'>:</Box>
      </Flex>
      <Flex p='0px 0px' direction='column' justify='flex-start' align='center'>
        <Box m='0px'>{getTimeLeft().hours || '00'}</Box>
        <Text fontSize='sm'>Hours</Text>
      </Flex>
      <Flex p='0px 2px' direction='column' justify='flex-start' align='center'>
        <Box m='0px'>:</Box>
      </Flex>
      <Flex p='0px 0px' direction='column' justify='flex-start' align='center'>
        <Box m='0px'>{getTimeLeft().minutes || '00'}</Box>
        <Text fontSize='sm'>Minutes</Text>
      </Flex>
    </Flex>
  )
}

export default CountDown
