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
 * Returns a list of notifications that the senior has sent
 * @param {String} caretakerUsername The caretaker's username
 */
module.exports = async (caretakerUsername) => {

    // Obtain the saved firebase app object from cache
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

    // Check to see if the caretaker has subscribed to the senior
    return await db.collection("notifications")
        .where("caretakerUsername", "==", caretakerUsername)
        //.orderBy("timestamp", "desc")
        .get()
        .then(async snapshot => {
            var response = [];
            await snapshot.forEach(doc => {
                response.push(doc.data());
            });

            for (let i = 0; i < response.length; i++){
                for (let j = i + 1; j < response.length; j++){
                    if (response[i].timestamp > response[j].timestamp){
                        let temp = response[i];
                        response[i] = response[j];
                        response[j] = temp;
                    }
                }
            }
            return response;
        }).catch(error => {
            var response = {
                status: "FAILURE",
                message: "Cannot obtain notifications!",
                details: error
            };
            return JSON.stringify(response);
        });
};