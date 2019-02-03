const E_ = 0.36787944117

export class GrinPurchaserDistributedMarks {
  private readonly totalDays: number
  private readonly quantsToSpend: RangeQuantToSpend[] = [] // indexed by day
  private readonly prices: number[] = [] // indexed by day
  private readonly totalDollars: number
  private dollarsSpent: number
  private grinAttained: number = 0

  constructor (totalDays: number, totalDollars: number, phase: number = 1, shift: number = 30) {
    this.totalDays = totalDays
    this.totalDollars = totalDollars
    this.dollarsSpent = 0
    const quant = Math.round(totalDollars / totalDays * 1000) / 1000

    for (let i = 0; i < totalDays; i ++) {
      this.quantsToSpend.push(new RangeQuantToSpend(quant, i, i + phase * shift))
    }
  }

  spendToday (day: number, price: number): number {
    const quants = this.quantsToSpend
    let total = 0

    for (let i = 0; i < quants.length; i ++) {
      const quant = quants[i]
      const startDay = quant.startDay
      const pricesInRange = this.prices.slice(startDay, day)
      if (quant.viableFor(day) && pricesInRange.every(p => p > price) && price < 11) {
        total += quant.dollars
        quant.spend()
      }
    }

    this.prices.push(price)
    this.dollarsSpent += total
    this.grinAttained += (total / price)
    return total
  }

  howDidWeDo (): {dollarsRemaining: number, grinAttained: number, optimal: number, optimalAtSpent: number, percentOfOptimal: number} {
    return {
      dollarsRemaining: this.totalDollars - this.dollarsSpent
      , grinAttained: this.grinAttained
      , optimal: this.optimalGrinAttained(this.totalDollars)
      , optimalAtSpent: this.optimalGrinAttained(this.dollarsSpent)
      , percentOfOptimal: this.grinAttained / this.optimalGrinAttained(this.totalDollars) * 100
    }
  }

  optimalGrinAttained (dollars: number): number {
    const minPrice = Math.min.apply(null,this.prices)
    return dollars * (1 / minPrice)
  }
}

class RangeQuantToSpend {
  readonly dollars: number
  readonly startDay : number
  readonly markedDay: number
  private spent = false

  constructor (dollars: number, startDay: number, endDay: number) {
    this.dollars = dollars
    this.markedDay = Math.ceil(startDay + (endDay - startDay) * E_)
    this.startDay = startDay
    // console.log(`StartDay: ${this.startDay} Marked: ${this.markedDay}`)
  }

  viableFor (day: number): boolean {
    return this.markedDay < day && !this.spent
  }

  spend (): void {
    this.spent = true
  }
}