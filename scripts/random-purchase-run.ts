import {arrayOfRandom, getRandomBigNumberInclusive} from '../test/random-helpers'
import {GrinPurchaserMarkedFromStart} from '../src/grin-purchaser-marked-from-start'

const gp = new GrinPurchaserMarkedFromStart(365, 20000, 1.2)
const prices = arrayOfRandom(() => getRandomBigNumberInclusive(0, 35).toNumber(), 365)
for (let i = 0 ; i < prices.length; i ++) {
  const spendToday = gp.spendToday(i + 1 , prices[i])
  if (spendToday > 0) {
    console.log(`Day ${i}, Price ${prices[i]}, ${spendToday}`)
  }
}
console.log(gp.howDidWeDo())
