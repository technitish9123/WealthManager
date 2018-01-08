const percent = require('percent');
const _ = require('underscore');

module.exports = (function () {
    function PortFolio(context) {
        if (!context) {
            return;
        }

        this.id = context.id;
        this.name = context.name;
        this.txns = context.txns;
        this.cashAmount = context.cashAmount;
        this.symbolDetails = [];
    }
    PortFolio.prototype.setSymbolDetails = function (sd) {
        this.symbolDetails = sd;
    };
    PortFolio.prototype.getChange = function () {
        let change = 0;
        _.each(this.symbolDetails, (symbolData) => {
            change += symbolData.dayGain
        });

        return change;
    };
    PortFolio.prototype.getCostBasis = function () {
        let costBasis = 0;
        _.each(this.symbolDetails, (symbolData) => {
            costBasis += symbolData.costBasis
        });

        return costBasis;
    };
    PortFolio.prototype.getMarketValue = function () {
        let marketValue = 0;
        _.each(this.symbolDetails, (symbolData) => {
            marketValue += symbolData.marketValue
        });

        marketValue += this.cashAmount;
        return marketValue;
    };
    PortFolio.prototype.getChangePct = function () {
        let change = this.getChange();
        let mktVal = this.getMarketValue();
        return percent.calc(change, mktVal, 2);
    };
    PortFolio.prototype.getGain = function () {
        let gain = 0;
        _.each(this.symbolDetails, (symbolData) => {
            gain += symbolData.gain
        });

        return gain;
    };
    PortFolio.prototype.getGainPct = function () {
        let gain = this.getGain();
        let costBasis = this.getCostBasis();
        return percent.calc(gain, costBasis, 2);
    };
    PortFolio.prototype.sortByPerformance = function () {
        return _.sortBy(this.symbolDetails, (symbolData) => {
            let gain = symbolData.gain;
            let costBasis = symbolData.costBasis;
            return -1 * percent.calc(gain, costBasis, 2);
        });
    };

    return PortFolio;
}());