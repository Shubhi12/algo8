const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config.json');
const constants = require('./config/constants');

class Connection {
    static connectToMongo() {
        if (this.db) return Promise.resolve(this.db);
        return MongoClient.connect(this.url, this.options)
            .then(db => this.db = db);
    }

    // or in the new async world
    static async connectToMongo() {
        if (this.db) return this.db;
        this.db = await MongoClient.connect(this.url, this.options);
        //console.log(this.db);

        return this.db;
    }
}

Connection.db = null;
Connection.url = config[constants.env].mongodbUrl;
Connection.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports = { Connection };