import { Map } from 'immutable'
import { MULTIPLIER, DOLLARS, BASE_COSTS } from 'utils/constants'

const pouch = {
  chair: {
    type: 'Chair',
    cost: (state) => {
      if (state.chairs === 0) return Map({ [DOLLARS]: -BASE_COSTS.CHAIR })
      return Map({
        [DOLLARS]: -(BASE_COSTS.CHAIR * (state.chairs * MULTIPLIER)),
      })
    },
    effect: () => {
      return Map({ [DOLLARS]: 0.1 })
    },
  },
  floor: {
    type: 'Floor',
    cost: (state) => {
      if (state.floors === 0) return Map({ [DOLLARS]: -BASE_COSTS.FLOOR })
      return Map({
        [DOLLARS]: -(BASE_COSTS.FLOOR * (state.floors * MULTIPLIER)),
      })
    },
    effect: () => {
      return Map({ [DOLLARS]: 0.5 })
    },
  },
  building: {
    type: 'Building',
    cost: (state) => {
      if (state.buildings === 0) return Map({ [DOLLARS]: -BASE_COSTS.BUILDING })
      return Map({
        [DOLLARS]: -(BASE_COSTS.BUILDING * (state.buildings * MULTIPLIER)),
      })
    },
    effect: () => {
      return Map({ [DOLLARS]: 4 })
    },
  },
  block: {
    type: 'Block',
    cost: (state) => {
      if (state.blocks === 0) return Map({ [DOLLARS]: -BASE_COSTS.BLOCK })
      return Map({
        [DOLLARS]: -(BASE_COSTS.BLOCK * (state.blocks * MULTIPLIER)),
      })
    },
    effect: () => {
      return Map({ [DOLLARS]: 7 })
    },
  },
}

export { pouch }
