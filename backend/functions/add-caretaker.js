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
* @returns {String} some value
*/
module.exports = async (username) => {

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

     var caretakerRef = db.collection("caretakers");

     // See if the data exists
     var caretakerCheckPromise = caretakerRef
        .where("username", "==", username)
        .get()
        .then(snapshot => {
            return snapshot.docs.length;
        }).catch(error => {
            return error;
        });
    
    var numResults = await caretakerCheckPromise;
    if (numResults != 0){
        return "An existing caretaker already exists!";
    }

    // Push the data
    var caretakerAddPromise = caretakerRef.add({
        username: username
    }).then(ref => {
        return ref.id;
    }).catch(error => {
        return error;
    });

    var output = await caretakerAddPromise;
    return output;
};