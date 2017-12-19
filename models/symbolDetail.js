const percent = require('percent');

module.exports = (function () {
    function SymbolDetail(quote, txn) {
        if (!quote) {
            return;
        }

        this.companyName = quote.companyName;
        this.symbol = quote.symbol;
        this.latestPrice = quote.latestPrice;
        this.change = quote.change;
        this.changePercent = quote.changePercent;
        this.marketCap = quote.marketCap;
        this.avgTotalVolume = quote.avgTotalVolume;
        this.open = quote.open;
        this.high = quote.high;
        this.low = quote.low;
        this.quantity = txn.quantity;

        this.costBasis = txn.buyPrice * this.quantity;  // cost basis
        this.marketValue = this.latestPrice * this.quantity;  // mkt value
        this.gain = this.marketValue - this.costBasis; // gain
        this.gainPct = percent.calc(this.gain, this.costBasis, 2)
        this.dayGain = this.change * this.quantity;
    }

    return SymbolDetail;
}());