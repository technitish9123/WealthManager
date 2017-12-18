const requestHttp = require('request-promise');
const portFolioData = require('./../db/portfolioData');
const portFolioModel = require('./../models/portfolio');
const overviewModel = require('./../models/overview');
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
            const totalResults = this.getDataFromDb();
            const resultForUserId = _.find(totalResults.users, (user) => user.id === id);
            const returnValue = new portFolioModel(resultForUserId);
            return returnValue;
        },
        getOverviewByUserId: function (id) {
            const userPortfolio = this.getPortfolioByUserId(id);
            const symbolList = _.map(userPortfolio.txns, function (txn) {
                return txn.symbolName;
            });

            return new Promise(function (resolve, reject) {
                let symbolOverViewList = [];

                quoteSvc.getAllSymbolListData(symbolList).then(res => {
                    _.each(symbolList, (symbol)=>{
                        const symbolOverView = new overviewModel(res[symbol].quote);  
                        symbolOverViewList.push(symbolOverView)
                    })
                    resolve(symbolOverViewList[0])
                }).catch(err => {
                    resolve(null);
                })
            });
        }
    }

    return PortfolioSvc;
}());
