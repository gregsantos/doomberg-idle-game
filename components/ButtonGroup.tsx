import * as React from 'react'
import { Flex, Button } from '@chakra-ui/core'
import { cost } from 'merchant.js'
import { whole } from 'utils/numbers'
import { DOLLARS } from 'utils/constants'
import { pouch } from 'utils/wallet'

type ButtonGroupProps = { gameState: any; buyBuilding: any; disabled: boolean }

const ButtonGroup = ({
  gameState,
  buyBuilding,
  disabled,
}: ButtonGroupProps) => {
  return (
    <Flex
      direction='column'
      maxHeight={['145px', '210px', '250px']}
      overflow='auto'
      pt={[1, 2, null, 3]}
    >
      {['chair', 'floor', 'building', 'block'].map((upgrade) => (
        <Button
          id={upgrade}
          mb={[1, 2, null, 3]}
          onClick={buyBuilding}
          variantColor='green'
          variant='outline'
          zIndex={100}
          _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
          isDisabled={disabled}
        >
          {`Buy a ${!disabled ? upgrade : '???'} ${whole(
            cost(pouch[upgrade], gameState).get(DOLLARS)
          )}`}
        </Button>
      ))}
    </Flex>
  )
}

export default ButtonGroup
