const requestHttp = require('request');
const moment = require('moment');
const _ = require('underscore');

const alphaVantageApiKey = '82N1GMV9Z2K0OVZL';

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

      requestHttp(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${alphaVantageApiKey}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        let stockDetails = '';
       
        let $today = new Date();
        let $yesterday = new Date($today);
        $yesterday.setDate($today.getDate() - 1); 

        let dayString = moment($today).format('YYYY-MM-DD');
        let details = body["Time Series (Daily)"][dayString];

        if (!details) {
          // timezone issue
          dayString = moment($yesterday).format('YYYY-MM-DD');
          details = body["Time Series (Daily)"][dayString];
        }
        _.each(details, (value, key) => {
          key = key.replace(/\d+\./, '');
          stockDetails += `${key} is ${value} `;
        })
        responseToUser = `Stock details for ${stockSymbol} on ${dayString} are as follows: ${stockDetails}`;
        sendResponse(responseToUser);
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
      responseToUser = 'This message is from Weather Manager! ';
      sendResponse(responseToUser);
    }
  };
  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  actionHandlers[action]();
};
