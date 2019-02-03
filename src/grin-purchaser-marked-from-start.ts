const E_ = 0.36787944117

export class GrinPurchaserMarkedFromStart {
  private readonly totalDays: number
  private readonly quantsToSpend: QuantToSpend[] = [] // indexed by day
  private readonly prices: number[] = [] // indexed by day
  private readonly totalDollars: number
  private dollarsSpent: number
  private grinAttained: number = 0

  constructor (totalDays: number, totalDollars: number, phase: number = 1) {
    this.totalDays = totalDays
    this.totalDollars = totalDollars
    this.dollarsSpent = 0
    const quant = Math.round(totalDollars / totalDays * 1000) / 1000

    for (let i = 0; i < totalDays; i ++) {
      this.quantsToSpend.push(new QuantToSpend(quant, phase * (i + 1)))
    }
  }

  spendToday (day: number, price: number): number {
    const quants = this.quantsToSpend
    let total = 0
    for (let i = 0; i < quants.length; i ++) {
      const quant = quants[i]
      if (quant.viableFor(day) && this.prices.every(p => p > price) && price < 11) {
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

class QuantToSpend {
  readonly dollars: number
  readonly markedDay: number
  private spent = false
  private outOfRangeAt: number

  constructor (dollars: number, spendWithinDays: number) {
    this.dollars = dollars
    this.outOfRangeAt = spendWithinDays
    this.markedDay = Math.ceil(spendWithinDays * E_)
    console.log(`Marked: ${this.markedDay}`)
  }

  viableFor (day: number): boolean {
    return this.markedDay < day && !this.spent
  }

  spend (): void {
    this.spent = true
  }
}