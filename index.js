var Client = require('node-rest-client').Client
  , AlexaSkill = require('./AlexaSkill')
  , APP_ID     = 'amzn1.echo-sdk-ams.app.bb59fb34-c0da-4127-80b1-bbf7e120f2b9';
 
 
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
 
 
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
 
 
var getJsonFromHANA = function(airline, callback){
  var sAirline = toTitleCase(airline);
  var options_auth={user:"RTL_USER",password:"Abcd1234"};
  client = new Client(options_auth);
  client.get(".....?$format=json&$filter=CARRNAME eq \'" + sAirline + "\'", function(data, response){
  if (data.d.results[0] != undefined){
  var Amount = data.d.results[0].PRICE;
  }else{
  var Amount = "Sorry I coudln't find that airline";
  }
  callback(Amount);
  }).on('error',function(err){
            callback("Sorry there was a connection error");
       });
}
 
 
var handleHANARequest = function(intent, session, response){
  getJsonFromHANA(intent.slots.airline.value, function(data){
  var text = data;
    var cardText = 'Total sales are: ' + text;
 
 
    var heading = 'Total sales for: ' + intent.slots.airline.value;
    response.tellWithCard(text, heading, cardText);
  });
};
 
 
var HANA = function(){
  AlexaSkill.call(this, APP_ID);
};
 
 
HANA.prototype = Object.create(AlexaSkill.prototype);
HANA.prototype.constructor = HANA;
 
 
HANA.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session){
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId);
};
 
 
HANA.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  // This is when they launch the skill but don't specify what they want.
  var output = 'Welcome to Varun\'s database. ' +
    'Say an Airline Name.';
 
 
  var reprompt = 'Which Airline would you like?';
 
 
  response.ask(output, reprompt);
 
 
  console.log("onLaunch requestId: " + launchRequest.requestId
      + ", sessionId: " + session.sessionId);
};
 
 
HANA.prototype.intentHandlers = {
  GetSAPHANAIntent: function(intent, session, response){
    handleHANARequest(intent, session, response);
  },
 
 
  HelpIntent: function(intent, session, response){
    var speechOutput = 'Get the total amount for any airline. ' +
      'Which Airline would you like?';
    response.ask(speechOutput);
  }
};
 
 
exports.handler = function(event, context) {
    var skill = new HANA();
    skill.execute(event, context);
};