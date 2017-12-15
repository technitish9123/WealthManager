const requestHttp = require('request-promise');

module.exports = (function () {

    function QuoteSvc() {
    }

    QuoteSvc.prototype = {
        getSymbolInformation: function (stockSymbol) {
            return new Promise(function (resolve, reject) {
                requestHttp({url : `https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`, json: true }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        getAllSymbolListData: function (stockSymbolArray) {
            const symbols = stockSymbolArray.join(',');

            return new Promise(function (resolve, reject) {
                requestHttp({url : `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote`, json: true }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }

    return QuoteSvc;
}());