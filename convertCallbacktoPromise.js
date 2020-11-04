const MongoClient = require('mongodb').MongoClient;

function convertCallbackToPromise() {
    // making db connection and fetching data
    // callback structure

    MongoClient.connect('mongodb://127.0.0.1/local', function(err, db) {
        try {
            if (err)
                throw err;
            else
                console.log("mongodb connected....");
            db.collection('users', function(err, data) {
                console.log(data);
            });
        } catch (err) {
            console.log(err);
        }

    });

    //promise structure

    const connection = new Promise((resolve, reject) => {
        MongoClient.connect('mongodb://127.0.0.1/local', function(err, db) {
            if (err)
                reject(err);
            else
                resolve(db);
        });
    });

    connection.then(db => {
        return new Promise((resolve, reject) => {
            db.collection("users", (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }).then(data => {
        console.log(data);
    }).catch(err => { console.log(err); });
}