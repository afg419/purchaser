const E_ = 0.36787944117

export class GrinPurchaserBabaioff {
  private readonly totalDays: number
  private readonly markedDay: number
  private readonly timesToPurchase: number
  private readonly quantityToSpend: number
  private topKPriorToMark: number[] = undefined
  private readonly prices: number[] = [] // indexed by day
  private readonly totalDollars: number
  private dollarsSpent: number
  private grinAttained: number = 0

  constructor (totalDays: number, totalDollars: number, timesToPurchase: number) {
    this.totalDays = totalDays
    this.totalDollars = totalDollars
    this.timesToPurchase = timesToPurchase
    this.quantityToSpend = totalDollars / timesToPurchase
    this.dollarsSpent = 0
    this.markedDay = Math.ceil(totalDays * E_)
  }

  spendToday (day: number, price: number): number {
    this.prices.push(price)

    if(day < this.markedDay){
      return 0
    } else {
      this.topKPriorToMark = (this.topKPriorToMark || this.determinTopKPriorToMark()).sort((a,b) => b - a) // descending order
      const max = this.topKPriorToMark[0]
      const { lessThan, greaterThan } = splitArray( this.topKPriorToMark, price )

      if (greaterThan.length > 0) {
        const toSpend = (this.quantityToSpend) * (greaterThan.length)
        this.dollarsSpent += toSpend
        this.grinAttained += toSpend * (1/price)
        this.topKPriorToMark.splice(0, greaterThan.length)
        console.log(`SPENT ON ${day}, at PRICE ${price}, remaining MINS ${this.topKPriorToMark}`)
        return toSpend
      }
    }
  }

  determinTopKPriorToMark() {
    const toReturn = this.prices.slice(0, this.markedDay).sort((a,b) => a - b).slice(0, this.timesToPurchase)
    return toReturn
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

function splitArray(array: number[], value: number): { lessThan: number[], greaterThan: number[] } {
  const lessThan = array.filter(p => p < value )
  const greaterThan = array.filter(p => p >= value )
  return { lessThan, greaterThan }
}

function removeByValue<T>(array: T[], value: T): T[] {
  for( let i = 0; i < array.length-1; i++){
    if ( array[i] === value) {
      console.log(`\n\n\n ${value} \n\n\n`)
      array.splice(i, 1)
      return array
    }
  }
  return array
}