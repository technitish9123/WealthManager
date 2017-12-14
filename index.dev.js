const requestHttp = require('request');
const QuoteSvc = require('./services/quoteService');
const PortFolioSvc = require('./services/portfolioService');
const stockSymbol = 'aapl';
const _ = require('underscore');

// let portfolio = new PortFolio(1);
// console.log(portfolio.getUser());

let id = 1;
let portFolioSvc = new PortFolioSvc();
let quoteSvc = new QuoteSvc();
console.log(quoteSvc.getSymbolInformation('AAPL', function (a) {
    console.log(a)
}));
console.log(portFolioSvc.getPortfolioByUserId(1));