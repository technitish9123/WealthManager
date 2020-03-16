const requestHttp = require('request');
const moment = require('moment');
const _ = require('underscore');
const QuoteSvc = require('./services/quoteService');
const PortFolioSvc = require('./services/portfolioService');
let quoteSvc = new QuoteSvc();
let portFolioSvc = new PortFolioSvc();

exports.WealthManager = function WealthManager(request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let responseToUser = '';
  let sendResponse = (text, context) => {
    response.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    let rs = {
      "speech": text, "displayText": text
      //"speech" is the spoken version of the response, "displayText" is the visual version
    }

    if (context) {
      rs.contextOut = [context];
    }
    response.send(JSON.stringify(rs));
  }
  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    'GetStockDetail': () => {
      const stockSymbol = parameters.StockName;
      if (!stockSymbol) {
        responseToUser = `I am not sure about this symbol. Can you try another?`; // Send simple response to user
        sendResponse(responseToUser);
      } else {
        quoteSvc.getSymbolinformation(stockSymbol).then(res)  => {
          let lastRefreshed = new Date(res.latestUpdate);
          let stockDetails = `Stock Details for ${res.companyName} with symbol ${res.symbol} are as follows:
      Open is ${res.open} and Close is ${res.close} with a high of ${res.high} and low of ${res.low}.
      Details last refreshed on ${lastRefreshed.toDateString()} at ${lastRefreshed.toTimeString()}`;
          sendResponse(stockDetails);
        }).catch(err => {
          sendResponse('Some Technical Error occurred! Apologies');
        });
      }
    },
    'MarketDetails': () => {
      quoteSvc.getAllMarketData().then(res => {
        let marketDetails =  `Dow Jones INDUSTRIAL AVERAGES is at ${res.dji.Close} ${res.dji.changeIdentifier} by ${res.dji.change.toFixed(2)} points, Nasdaq is at ${res.ndq.Close} ${res.ndq.changeIdentifier} by ${res.ndq.change.toFixed(2)} points.`;
        sendResponse(marketDetails);
      }).catch(err => {
        sendResponse('Some Technical Error occurred! Apologies');
      });
    },

    'GetOverView': () => {
      const userId = 1;
      portFolioSvc.getPortfolioByUserId(userId).then(res => {
        let overViewDetail = `Your portfolio shows a gain of ${res.getGain().toFixed(2)}$ or ${res.getGainPct()}%.
        Total change is ${res.getChange().toFixed(2)}$ or ${res.getChangePct()}% with a market value of ${res.getMarketValue().toFixed(2)}$.
        Would you like to know portfolios' best performers?`;
          sendResponse(overViewDetail);
      }).catch(err => {
        sendResponse('Some Technical Error occurred! Apologies');
      });
    },
    'Portfolio.Overview.best.performer.yes': () => {
      const userId = 1;
      let index = 0;
      _.each(inputContexts, (inpContext) => {
        if (inpContext.name === 'portfoliooverview-followup') {
          index = parseInt(inpContext.parameters.BestPerformerIndex);
        }
      });
      portFolioSvc.getPortfolioBestPerformers(userId).then(res => {
        let overViewDetail = '';
        let contextOut = null;
        if (index < res.length) {
          overViewDetail = `${index > 0 ? 'Next' : ''} Best performer in the portfolio is ${res[index].companyName} with symbol ${res[index].symbol}.
         It shows a gain of ${res[index].gain.toFixed(2)}$ or ${res[index].gainPct}. Do you want to know the next one?`;
          let next = index + 1;
          contextOut = {
            'name': 'portfoliooverview-followup',
            'lifespan': 5,
            'parameters': { 'BestPerformerIndex': next }
          };
        } else {
          overViewDetail = 'No more symbols in the list.';
          contextOut = {
            'name': 'portfoliooverview-followup',
            'lifespan': 0,
            'parameters': { 'BestPerformerIndex': 0 }
          };
        }

        sendResponse(overViewDetail, contextOut);
      }).catch(err => {
        sendResponse('Some Technical Error occurred! Apologies');
      });
    },
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
    'input.welcome': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      responseToUser = 'Hello, Welcome to my Dialogflow agent!'; // Send simple response to user
      sendResponse(responseToUser);
    },
    // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
    'input.unknown': () => {
      responseToUser = 'I\'m having trouble, can you try that again?'; // Send simple response to user
      sendResponse(responseToUser);
    },
    // Default handler for unknown or undefined actions
    'default': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      responseToUser = 'This message is from Wealth Manager! ';
      sendResponse(responseToUser);
    }
  };
  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  actionHandlers[action]();
};
