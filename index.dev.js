const requestHttp = require('request-promise');
const QuoteSvc = require('./services/quoteService');
const PortFolioSvc = require('./services/portfolioService');
const stockSymbol = 'aapl';
const _ = require('underscore');

// let portfolio = new PortFolio(1);
let portFolioSvc = new PortFolioSvc();
// console.log(portfolio.getUser());

let id = 1;
// const userPortfolio = portFolioSvc.getPortfolioByUserId(id);
// userPortfolio
// const symbolList = _.filter(userPortfolio.txns, function (txn) {
//     return txn.symbolName == 'AAPL'
// });
// console.log(symbolList);



// portFolioSvc.getPortfolioBestPerformers(id).then(res => {
//     console.log(res);
// });
let quoteSvc = new QuoteSvc();

// quoteSvc.getSymbolInformation(stockSymbol).then(res => {
//     let lastRefreshed = new Date(res.latestUpdate);
//     let stockDetails = `Stock Details for ${res.companyName} with symbol ${res.symbol} are as follows:
// Open is ${res.open} and Close is ${res.close} with a high of ${res.high} and low of ${res.low}.
// Details last refreshed on ${lastRefreshed.toDateString()} at ${lastRefreshed.toTimeString()}`;
//     console.log(stockDetails);
// }).catch(err => {
//     console.log('Some Technical Error occurred! Apologies');
// });


quoteSvc.getAllMarketData().then(res => {
    let marketDetails =  `Dow Jones INDUSTRIAL AVERAGES is at ${res.dji.Close} ${res.dji.changeIdentifier} by ${res.dji.change.toFixed(2)} points, Nasdaq is at ${res.ndq.Close} ${res.ndq.changeIdentifier} by ${res.ndq.change.toFixed(2)} points.`;
    console.log(marketDetails)
});
// console.log(portFolioSvc.getOverviewByUserId(1));

// requestHttp(`https://api.iextrading.com/1.0/stock/${stockSymbol}/quote11`).then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log('hi');
// });