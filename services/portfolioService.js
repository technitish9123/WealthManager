const requestHttp = require('request');
const portFolioData = require('./../db/portfolioData');
const portFolioModel = require('./../models/portfolio');

const _ = require('underscore');

module.exports = (function () {

    function PortfolioSvc() {
    }

    PortfolioSvc.prototype = {
        getDataFromDb: function () {
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
        }
    }

    return PortfolioSvc;
}());
