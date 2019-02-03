import {arrayOfRandom, getRandomBigNumberInclusive, getRandomBool} from '../test/random-helpers'
import {GrinPurchaserMarkedFromStart} from '../src/grin-purchaser-marked-from-start'
import {GrinPurchaserDistributedMarks} from '../src/grin-purchaser-distributed-marks'
import {GrinPurchaserBabaioff} from '../src/grin-purchaser-babaioff'
import {GrinPurchaserOneBuy} from '../src/grin-purchaser-one-buy'

const gp = new GrinPurchaserMarkedFromStart(365, 20000, 1.2)
const gp2 = new GrinPurchaserDistributedMarks(365, 20000, 1.2, 60)
const gp3 = new GrinPurchaserBabaioff(365, 20000, 15)
const gp4 = new GrinPurchaserOneBuy(365, 20000)

// const prices = arrayOfRandom(randomWalk(0.01, 0.30), 365)
const prices = arrayOfRandom(() => getRandomBigNumberInclusive(0, 35).toNumber(), 365)

for (let i = 0 ; i < prices.length; i ++) {
  const spendToday = gp.spendToday(i + 1 , prices[i])
  // console.log(`GP1: Day ${i}, Price ${prices[i]}, ${spendToday}`)
}
console.log(gp.howDidWeDo())

for (let i = 0 ; i < prices.length; i ++) {
  const spendToday = gp2.spendToday(i + 1 , prices[i])
  // console.log(`GP2: Day ${i}, Price ${prices[i]}, ${spendToday}`)
}
console.log(gp2.howDidWeDo())

for (let i = 0 ; i < prices.length; i ++) {
  const spendToday = gp3.spendToday(i + 1 , prices[i])
  // console.log(`GP2: Day ${i}, Price ${prices[i]}, ${spendToday}`)
}
console.log(gp3.howDidWeDo())

for (let i = 0 ; i < prices.length; i ++) {
  const spendToday = gp4.spendToday(i + 1 , prices[i])
  // console.log(`GP2: Day ${i}, Price ${prices[i]}, ${spendToday}`)
}
console.log(gp4.howDidWeDo())

function randomWalk(walkLengthLowPercent: number, walkLengthHighPercent: number): ( i: number, prev: number ) => number {
  return (i, prev_) => {
    const prev = prev_ || 7
    const negative = getRandomBool() ? -1 : 1
    const walk = getRandomBigNumberInclusive(prev * walkLengthLowPercent, prev * walkLengthHighPercent).toNumber() * negative
    return Math.max(0.0000001, prev + walk)
  }
}
