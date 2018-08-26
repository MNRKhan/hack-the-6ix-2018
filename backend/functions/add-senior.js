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
* @param {String} homeAddress Some letters, I guess
* @param {String} phoneNumber Some letters, I guess
* @returns {String} some value
*/
module.exports = async (username, homeAddress, phoneNumber) => {

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

     var seniorsRef = db.collection("seniors");

     // See if the data exists
     var seniorsCheckPromise = seniorsRef
        .where("username", "==", username)
        .get()
        .then(snapshot => {
            return snapshot.docs.length;
        }).catch(error => {
            return error;
        });
    
    var numResults = await seniorsCheckPromise;
    if (numResults != 0){
        return "An existing senior already exists!";
    }

    // Push the data
    var seniorsAddPromise = seniorsRef.add({
        username: username,
        homeAddress: homeAddress,
        phoneNumber: phoneNumber
    }).then(ref => {
        return ref.id;
    }).catch(error => {
        return error;
    });

    var output = await seniorsAddPromise;
    return output;
};