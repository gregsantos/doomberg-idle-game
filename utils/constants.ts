const MULTIPLIER = 1.15
const DOLLARS = 'DOLLARS'
const BASE_COSTS = {
  CHAIR: 15,
  FLOOR: 100,
  BUILDING: 500,
  BLOCK: 700,
}
// 22645 days, 543480 hrs, gameTime ~150hrs
// avg lifespan 71yr = 31536000000 ms
// 31536000000 * (71 - 13) (13 is age at start of game)
const INITIAL_TIME = 31536000000 * (71 - 13)
//  new Date().setFullYear(new Date().getFullYear() + 62) - Math.floor(Date.now())

const INTERVAL = 100 // 0.1 second

export { MULTIPLIER, DOLLARS, INITIAL_TIME, INTERVAL, BASE_COSTS }
