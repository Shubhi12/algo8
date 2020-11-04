const jwt = require('jsonwebtoken');
const { resolveContent } = require('nodemailer/lib/shared');
const config = require('../config/config');
const constants = require('../config/constants');
const { Connection } = require('../connection');
const client = Connection.connectToMongo();



module.exports = {
    getAccessToken,
    getRefreshToken,
    getUpdatedRefreshToken
};

function getAccessToken(payload) {
    return jwt.sign({ user: payload }, config[constants.env].secret, { expiresIn: 900 }); // expires in 15 mins
}

function getRefreshToken(payload) {
    client.then(client => {
        let db = client.db('local');
        let tokens = db.collection('tokens');

        new Promise((resolve, reject) => {
            tokens.find({ userId: payload.id }).toArray(function(err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        }).then((userRefreshTokens) => {

            // check if there are 4 (for multiple platform) or more refresh tokens,
            // which have already been generated. In this case we should
            // remove all this refresh tokens 
            if (userRefreshTokens.length >= 4) {
                tokens.deleteMany({ userId: payload.id });
            }

            const refreshToken = jwt.sign({ user: payload }, config[constants.env].secret, { expiresIn: '30d' });

            tokens.insert({ userId: payload.id, token: refreshToken });

            return refreshToken;
        }).catch((err) => {
            console.log(err);
        });
    });
}

function getUpdatedRefreshToken(oldRefreshToken, payload) {
    // create new refresh token
    const newRefreshToken = jwt.sign({ user: payload }, config[constants.env].secret, { expiresIn: '30d' });
    // replace current refresh token with new one
    client.then(client => {
        let db = client.db('local');
        let tokens = db.collection('tokens');

        tokens.replaceOne({ token: oldRefreshToken }, { userId: payload.id, token: newRefreshToken });
    });

    return newRefreshToken;
}