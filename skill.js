/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("sendtoPushBulletIntent" === intentName) {
        sendToPushBullet(intent, session, callback);
    } else if ("AMAZON.YesIntent" === intentName) {
        sendToPushBullet(intent,session,callback)
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback)
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName || "AMAZON.NoIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function handleSessionEndRequest(callback) {
    var cardTitle = null;
    var speechOutput = null;
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "I can send texts for you, just say something like, send a text to John";
    var repromptText = ""
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function sendToPushBullet(intent, session, callback) {
    var cardTitle = querySlot
    var cardText = "Hello World!"
    var speechOutput = "";
    var repromptText = "";
    var shouldEndSession = false;
    if (session.attributes) {
        querySlot = session.attributes.query;
        numberSlot = session.attributes.numberSlot;
    }
    if(!querySlot) {
        var querySlot = intent.slots.query.value;
    }
    if(!numberSlot) {
        var numberSlot = intent.slots.number.value;
    }
    console.log(querySlot)
    console.log(numberSlot)
    if ((numberSlot == undefined) && (querySlot == undefined)) {
        speechOutput = "Please Specify Who you would like to send this to and what you would like to say.";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
    if ((numberSlot == undefined) && (querySlot !== undefined)) {
        console.log("#1")
        speechOutput = "Who do you want me to send this to?";
        sessionAttributes = createQueryAttribute(querySlot)
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
    if ((numberSlot !== undefined) && (querySlot == undefined)) {
        speechOutput = "What do you want to say?"
        sessionAttributes = createNumberAttribute(numberSlot)
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
    if ((numberSlot !== undefined) && (querySlot !== undefined)) {
        console.log("BOTH")


        var querySlot = capitalizeFirstLetter(querySlot);
        if (isNaN(numberSlot) && numberSlot !== undefined) {
            switch(numberSlot) {
                // Here is where you would put your cases for contact names
                default:
                    speechOutput = "Please Specify a vaild contact name."
                    callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    break
            }
        } else {
            numberSlot = numberSlot.replace(/zero/g, "0")
            numberSlot = numberSlot.replace(/ o /g, "1")
            numberSlot = numberSlot.replace(/one/g, "1")
            numberSlot = numberSlot.replace(/two/g, "2")
            numberSlot = numberSlot.replace(/three/g, "3")
            numberSlot = numberSlot.replace(/four/g, "4")
            numberSlot = numberSlot.replace(/five/g, "5")
            numberSlot = numberSlot.replace(/six/g, "6")
            numberSlot = numberSlot.replace(/seven/g, "7")
            numberSlot = numberSlot.replace(/eight/g, "8")
            numberSlot = numberSlot.replace(/nine/g, "9")
            numberSlot = numberSlot.replace(/ /g, "")
        }
        if ("AMAZON.YesIntent" !== intent.name) {
            sessionAttributes = createBothAttribute(numberSlot, querySlot)
            speechOutput = "I am about to send " + querySlot + " to <say-as interpret-as=\"digits\">" + numberSlot + "</say-as>, is that right?"
    
            callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        } else {
            
            sendText(numberSlot, querySlot, callback)
        }
    }
}

function sendText(numberSlot, querySlot, callback) {
    var cardTitle = querySlot + " to " + numberSlot
    var cardText = ""
    var speechOutput = "";
    var repromptText = "";
    var shouldEndSession = true;
    var https = require('https');
    var text = {"type":"push","targets":["stream","android","ios"],"push":{"package_name":"com.pushbullet.android","target_device_iden":"","source_user_iden":"","message": querySlot,"type":"messaging_extension_reply","conversation_iden":"+1"+numberSlot}}
        text = JSON.stringify(text)
        console.log(text)
        
        var headers = {
            'Access-Token': '',
            'Content-Type': 'application/json',
        };
        
        
  // An object of options to indicate where to post to
  var post_options = {
      host: 'api.pushbullet.com',
      path: '/v2/ephemerals',
      method: 'POST',
      headers: headers
  };

  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          if (chunk = {}) {
              speechOutput = "Text Sent to <say-as interpret-as=\"digits\">" + numberSlot + "</say-as>!"
              cardText = "Text Sent!"
          } else {
              speechOutput = "Text was not sent to <say-as interpret-as=\"digits\">" + numberSlot + "</say-as>."
              cardText = "Text was sent unsuccessfully."
          }
          
          callback({},buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
      });
  });

  // post the data
  post_req.write(text);
  post_req.end();
  
}
function createQueryAttribute(querySlot) {
    return {
        query: querySlot
    };
}
function createNumberAttribute(numberSlot) {
    return {
         numberSlot: numberSlot
    };
}
function createBothAttribute(numberSlot, querySlot) {
    return {
         numberSlot: numberSlot,
         query: querySlot
    };
}
// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession, cardContent) {
    if (title === null && output === null) {
        return {
            shouldEndSession: shouldEndSession
        };
    } else {
        
        return {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>" + output + "</speak>"
            },
            card: {
                type: "Simple",
                title: title,
                content: cardContent
            },
            reprompt: {
                outputSpeech: {
                    type: "PlainText",
                    text: repromptText
                }
            },
            shouldEndSession: shouldEndSession
        };
    }
    
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        response: speechletResponse,
        sessionAttributes: sessionAttributes
    };
}