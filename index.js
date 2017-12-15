const requestHttp = require('request');
const moment = require('moment');
const _ = require('underscore');
const QuoteSvc = require('./services/quoteService');

let quoteSvc = new QuoteSvc();

exports.WealthManager = function WealthManager(request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let responseToUser = '';
  let sendResponse = (text) => {
    response.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    response.send(JSON.stringify({
      "speech": text, "displayText": text
      //"speech" is the spoken version of the response, "displayText" is the visual version
    }));
  }
  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    'GetStockDetail': () => {
      const stockSymbol = parameters.StockName;
      if (!stockSymbol) {
        responseToUser = `I am not sure about this symbol. Can you try another?`; // Send simple response to user
        sendResponse(responseToUser);
      } else {
        quoteSvc.getSymbolInformation(stockSymbol).then(res => {
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
