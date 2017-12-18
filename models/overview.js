module.exports = (function () {
    function Overview(context) {
        if (!context) {
            return;
        }

        this.companyName = context.companyName;
        this.symbol = context.symbol;
        this.latestPrice = context.latestPrice;
        this.change = context.change;
        this.changePercent = context.changePercent;
        this.marketCap = context.marketCap;
        this.avgTotalVolume = context.avgTotalVolume;
        this.open = context.open;
        this.high = context.high;
        this.low = context.low;
    }

    return Overview;
}());