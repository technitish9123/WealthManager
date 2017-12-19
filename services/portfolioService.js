const requestHttp = require('request-promise');
const portFolioData = require('./../db/portfolioData');
const portFolioModel = require('./../models/portfolio');
const SymbolDetail = require('./../models/symbolDetail');
const QuoteSvc = require('./../services/quoteService');

let quoteSvc = new QuoteSvc();
const _ = require('underscore');

module.exports = (function () {

    function PortfolioSvc() {
    }

    PortfolioSvc.prototype = {
        getDataFromDb: function () {
            // make it a promise
            return portFolioData;
        },
        getPortfolioByUserId: function (id) {
            const userData = this.getDataFromDb();

            return new Promise(function (resolve, reject) {
                const resultForUserId = _.find(userData.users, (user) => user.id === id);

                const userportfolio = new portFolioModel(resultForUserId);

                const symbolsInPortfolio = _.map(userportfolio.txns, function (txn) {
                    return txn.symbolName;
                });
                let symbolDetailList = [];

                quoteSvc.getAllSymbolListData(symbolsInPortfolio).then(res => {
                    _.each(symbolsInPortfolio, (symbol) => {

                        const symbolProperties = _.find(userportfolio.txns, function (txn) {
                            return txn.symbolName == symbol
                        });

                        const symbolDetail = new SymbolDetail(res[symbol].quote, symbolProperties);
                        symbolDetailList.push(symbolDetail)
                    });

                    userportfolio.setSymbolDetails(symbolDetailList);
                    resolve(userportfolio)
                }).catch(err => {
                    resolve(null);
                })
            });
        },
        getOverviewByUserId: function (id) {

        }
    }

    return PortfolioSvc;
}());
