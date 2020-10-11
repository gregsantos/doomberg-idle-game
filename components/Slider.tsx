import * as React from 'react'

import { Flex, Text } from '@chakra-ui/core'

type SliderProps = {
  id: string
}

const Slider = ({ id = 'Leverage' }: SliderProps) => (
  <Flex id='slider' align='center' direction={['row', 'row', 'column']}>
    <Flex align='center' m={2} zIndex={100}>
      <Text fontSize='sm' mr={2}>
        {id}
      </Text>
      <label className='switch'>
        <input type='checkbox' />
        <span className='slider'></span>
      </label>
    </Flex>
  </Flex>
)

export default Slider
