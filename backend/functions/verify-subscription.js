const envVariables = require("./../env.json");

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
* This is my function, it likes the greek alphabet
* @param {String} seniorUsername A senior username
* @param {String} caretakerUsername A caretaker's username
* @returns {boolean} true if there is a subscription between the caretaker and the senior; else false.
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

     var subscriptionsRef = db.collection("subscriptions");

     // See if the data exists
     var subCheckPromise = subscriptionsRef
        .where("seniorUsername", "==", seniorUsername)
        .where("caretakerUsername", "==", caretakerUsername)
        .get()
        .then(snapshot => {
            return snapshot.docs.length;
        }).catch(error => {
            return error;
        });
    
    var numSubscriptions = await subCheckPromise;

    if (numSubscriptions == 1)
        return true;
    return false;
};