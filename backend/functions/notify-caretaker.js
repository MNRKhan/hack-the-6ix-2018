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
* Notifies the caretaker about the event.  
* @param {String} seniorUsername Some letters, I guess
* @param {String} message True or false?
* @param {Number} timestamp True or false?
* @param {Number} priority The priority of the notification
* @returns {String} some value
*/
module.exports = async (seniorUsername, message, timestamp, priority = 1) => {

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

    // Get the list of caretakers subscribed
    return await db.collection("subscriptions")
        .where("seniorUsername", "==", seniorUsername)
        .get()
        .then(async snapshot => {
            await snapshot.forEach(async doc => {
                var caretakerUsername = doc.data().caretakerUsername;

                await db.collection("notifications").add({
                    seniorUsername: seniorUsername,
                    caretakerUsername: "joe",
                    timestamp: timestamp,
                    message: message,
                    priority: priority
                }).then(ref => {
                    var message = {
                        status: "SUCCESS",
                        message: ref.id
                    };
                    return JSON.stringify(message);
                }).catch(error => {
                    var message = {
                        status: "FAILURE",
                        message: error
                    };
                    return JSON.stringify(message);
                });
            });
            return "SUCCESS";
        }).catch(error => {
            return error;
        });
};