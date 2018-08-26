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

module.exports = async (seniorUsername = 'bob', caretakerUsername = "joe") => {

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
    return await db.collection("subscriptions")
        .where("seniorUsername", "==", seniorUsername)
        .where("caretakerUsername", "==", caretakerUsername)
        .get()
        .then(async snapshot => {
            if (snapshot.docs.length != 1)
                return "{ error: \"FAILURE: Cannot find the subscription!\" }"; 
            else{
                // Query the database
                return await db.collection("past-locations")
                    .where("username", "==", seniorUsername)
                    //.orderBy("timestamp", "desc")
                    .get()
                    .then(async snapshot => {
                        var response = [];
                        await snapshot.forEach(doc => {
                            response.push(doc.data());
                        });

                        for (let i = 0; i < response.length; i++){
                            for (let j = i + 1; j < response.length; j++){
                                if (response[i].timestamp < response[j].timestamp){
                                    let temp = response[i];
                                    response[i] = response[j];
                                    response[j] = response[i];
                                }
                            }
                        }
                        return response;
                    }).catch(error => {
                        return error;
                    });
            }
        }).catch(error => {
            return "{ error: \"FAILURE: Cannot verify subscription! Additional info: " + error + " \" }"; 
        });
};