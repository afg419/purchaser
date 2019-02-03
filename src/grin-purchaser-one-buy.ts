const E_ = 0.36787944117

export class GrinPurchaserOneBuy {
  private readonly totalDays: number
  private readonly prices: number[] = [] // indexed by day
  private readonly totalDollars: number
  private readonly markedDay: number
  private dollarsSpent: number
  private grinAttained: number = 0

  constructor (totalDays: number, totalDollars: number) {
    this.totalDays = totalDays
    this.totalDollars = totalDollars
    this.dollarsSpent = 0
    this.markedDay = Math.ceil(totalDays * E_)
  }

  spendToday (day: number, price: number): number {
    if(day < this.markedDay) {
      this.prices.push(price)
      return 0
    }

    const min = Math.min.apply(null, this.prices)
    if (min > price){
      console.log(`Min: ${min}`)
      console.log(`Price: ${price}`)
      this.dollarsSpent = this.totalDollars
      this.grinAttained = this.totalDollars / price
      this.prices.push(price)
      return this.totalDollars
    }

    this.prices.push(price)
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