const envVariables = require("./../env.json");

const lib = require('lib')({token: 'xJNNuSI0hj--kvOV1AuHxgFTDTJsGuHI4Oi7ncKk8xm1bkQ2sXYrmw8rQgtuOOn5'});
const sms = lib.messagebird.sms['@0.1.3'];

const   config = {
        apiKey: envVariables.firebaseApiKey,
        authDomain: envVariables.firebaseAuthDomain,
        databaseURL: envVariables.firebaseDatabaseURL,
        projectId: envVariables.firebaseProjectId,
        storageBucket: envVariables.firebaseStorageBucket,
        messagingSenderId: envVariables.firebaseMessagingSenderId
};

const firebase = require("firebase");
let cache = null;

/**
* It will make a subscription request for the caretaker to monitor the senior by
* sending an SMS with a unique URL and token.
* @param {String} seniorUsername A senior username
* @param {String} caretakerUsername A caretaker's username
* @returns {String} some value
*/
module.exports = async (seniorUsername, caretakerUsername) => {

    // Obtain the firebase app from cache
    if (cache === null) {
        cache = firebase.initializeApp(config);
        var app = cache;
        var db = app.firestore();
        db.settings({ timestampsInSnapshots: true });
     }
     else{
        var app = cache;
        var db = app.firestore();
     }

     var subRequestRef = db.collection("subscription-requests");

     // See if the data exists
     var subRequestPromise = subRequestRef
        .where("seniorUsername", "==", seniorUsername)
        .where("caretakerUsername", "==", caretakerUsername)
        .get()
        .then(snapshot => {
            return snapshot.docs.length;
        }).catch(error => {
            return error;
        });
    
    var numResults = await subRequestPromise;
    if (numResults != 0){
        return "FAILURE: A subscription request was already made!";
    }

    // Push the data
    var subscriptionRequestPromise = await subRequestRef.add({
        seniorUsername: seniorUsername,
        caretakerUsername: caretakerUsername
    }).then(ref => {
        return ref.id;
    }).catch(error => {
        return error;
    });
    var subscriptionRequestID = await subscriptionRequestPromise;

    // Get the phone number of the senior
    var seniorDb = db.collection("seniors");
    var seniorPromise = seniorDb
        .where("username", "==", seniorUsername)
        .get()
        .then(snapshot => {
            let phoneNumber = null;
            snapshot.forEach(doc => {
                phoneNumber = doc.data().phoneNumber;
            });
            return phoneNumber;
        }).catch(error => {
            return error;
        });    
    var phoneNumber = await seniorPromise;

    // Send an SMS message to the senior
    let result = await sms.create({
        originator: "14502341603",
        recipient: phoneNumber, // (required)
        body: 'Hello! A caretaker, ' + caretakerUsername + " wants to see if you are safe! Click on the url to accept the request! \n" + "https://elderly-monitoring-project-webapp.lib.id/Elderly-App@dev/accept-subscription-request/?token=" +  subscriptionRequestID // (required)
    });
    return "Success!";
};