// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();

var request = require('request');

// automatically allow cross-origin requests
app.use(cors({origin: true}));

// build your endpoints here.
app.get('/:email', (req, res, next) => {
    var options = {
        url: `https://haveibeenpwned.com/api/v2/breachedaccount/${req.params.email}`,
        headers: {
            'User-Agent': 'Firebase',
            'content-type': 'application/json'
        }
    };

    function callback(error, response, body) {
        if(!error && response.statusCode === 200){
            res.send(JSON.parse(body));
            return;    
        }
        else if(response.statusCode === 404){
            res.send({
                message: "Your email is secure"
            });
            return;
        }
        // request failed
        res.status(response.statusCode).send("Something went wrong");
    }
    
    request(options, callback);
    
});

// expose Express API as a single cloud function:
exports.api = functions.https.onRequest(app);