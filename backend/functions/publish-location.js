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
* @param {String} username Some letters, I guess
* @param {Number} timestamp And a number
* @param {Number} latitude True or false?
* @param {Number} longitude True or false?
* @returns {String} some value
*/
module.exports = async (username, timestamp, latitude, longitude) => {

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

    // Push the data
    var pastLocationsRef = db.collection("past-locations");
    var pastLocationPromise = pastLocationsRef.add({
        username: username,
        timestamp: timestamp,
        latitude: latitude,
        longitude: longitude
    }).then(ref => {
        return ref.id;
    }).catch(error => {
        return error;
    });

    var output = await pastLocationPromise;
    return output;
};