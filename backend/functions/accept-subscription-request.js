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
* It will be triggered when the senior responds to a URL sent by SMS.
* @param {String} token The unique token to the url.
* @returns {String} some value
*/
module.exports = async (token) => {

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

    // Get the metadata of the document you want to delete
    return await db.collection("subscription-requests").doc(token).get().then(async doc => {
        if (!doc.exists)
            return "FAILURE: Doc does not exist!";
        else{
            let seniorUsername = doc.data().seniorUsername;
            let caretakerUsername = doc.data().caretakerUsername;

            // Delete the doc
            await db.collection("subscription-requests").doc(token).delete().then(async () => {

                // Add the doc to the list of valid subscriptions
                await db.collection("subscriptions").add({
                    seniorUsername: seniorUsername,
                    caretakerUsername: caretakerUsername,
                }).then(ref => {
                    return ref.id;
                }).catch(error => {
                    return error;
                });
            }).catch(error => {
                return "FAILURE: Cannot add to valid subscriptions: " + error;
            });
        }
     }).catch(error => {
         return error;
     });
};