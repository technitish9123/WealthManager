const requestHttp = require('request');

module.exports = (function () {

    function QuoteSvc() {
    }

    QuoteSvc.prototype = {
        getSymbolInformation: function (stockSymbol, callback) {
            requestHttp(`https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`, { json: true }, (err, res, body) => {
                if (err) {
                    return 'Some Technical Error occurred! Apologies.';
                }
                let lastRefreshed = new Date(body.latestUpdate);
                let stockDetails = `Stock Details for ${body.companyName} with symbol ${body.symbol} are as follows:
                Open is ${body.open} and Close is ${body.close} with a high of ${body.high} and low of ${body.low}.
                Details last refreshed on ${lastRefreshed.toDateString()} at ${lastRefreshed.toTimeString()}`;
                callback(stockDetails);
            });
        }
    }

    return QuoteSvc;
}());