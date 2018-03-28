const requestHttp = require('request-promise');
const _ = require('underscore');
const csv = require('csvtojson');
module.exports = (function () {

    function QuoteSvc() {
    }

    QuoteSvc.prototype = {
        getSymbolInformation: function (stockSymbol) {
            return new Promise(function (resolve, reject) {
                requestHttp({ url: `https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`, json: true }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        getAllSymbolListData: function (stockSymbolArray) {
            const symbols = stockSymbolArray.join(',');

            return new Promise(function (resolve, reject) {
                requestHttp({ url: `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote`, json: true }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        getAllMarketData: function () {
            let marketDetailsCSV = {};
            let marketDetails = {};

            return new Promise(function (resolve, reject) {
                requestHttp({ url: `https://stooq.com/q/l/?s=^dji&h&e=csv`, json: true }).then(res => {
                    marketDetailsCSV.dji = res;
                })
                    .then(() => {
                        return requestHttp({
                            url: `https://stooq.com/q/l/?s=^ndq&h&e=csv`, json: true
                        })
                    })
                    .then(res => {
                        marketDetailsCSV.ndq = res;
                    })
                    .then(() => {
                        csv()
                            .fromString(marketDetailsCSV.dji)
                            .on('json', (json) => {
                                marketDetails.dji = json;
                            })
                            .on('done', () => {
                                csv()
                                    .fromString(marketDetailsCSV.ndq)
                                    .on('json', (json) => {
                                        marketDetails.ndq = json;
                                    })
                                    .on('done', () => {
                                        marketDetails.dji.change = Math.abs(marketDetails.dji.Close - marketDetails.dji.Open);
                                        marketDetails.dji.changeIdentifier = marketDetails.dji.Close - marketDetails.dji.Open > 0 ? 'up' : 'down';
                                        marketDetails.ndq.change = Math.abs(marketDetails.ndq.Close - marketDetails.ndq.Open);
                                        marketDetails.ndq.changeIdentifier = marketDetails.ndq.Close - marketDetails.ndq.Open > 0 ? 'up' : 'down';
                                        resolve(marketDetails)
                                    })
                            })

                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
    }

    return QuoteSvc;
}());