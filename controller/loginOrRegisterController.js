var bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');
const { response } = require('express');
const config = require('../config/config.json');
const constants = require('../config/constants');
const { Connection } = require('./../connection');
const client = Connection.connectToMongo();
const jwtService = require('../auth/jwt');
const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectID;
const uuidv1 = require('uuid/v1');




module.exports = { register, login, refreshToken };
/**
 * Name:register
 * Desc: This function helps users to register with username and password.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function register(req, res, next) {

    const userData = req.body;

    if (!userData || !userData.username || !userData.email || !userData.password) {
        commonHelper.sendJson(res, {}, constants.TRUE, 'Please enter all the required fields!!!', constants.SUCCESS, 1);
    }

    client.then(client => {
        let db = client.db('local');
        let users = db.collection('users');

        new Promise((resolve, reject) => {
            users.findOne({ email: userData.email }, function(err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        }).then(data => {
            if (data) {
                commonHelper.sendJson(res, {}, constants.TRUE, 'User Already Exists', constants.SUCCESS, 1);
                return;
            } else {
                // insert new user
                //hash the password with bcrypt
                const saltRounds = 10;
                const passwordHash = bcrypt.hashSync(userData.password, saltRounds);
                users.insert({ email: userData.email, username: userData.username, password: passwordHash, userId: uuidv1() }, function(err, data) {
                    if (err) {
                        commonHelper.sendJson(res, {}, constants.TRUE, 'Something went Wrong!!!', constants.SUCCESS, 1);
                    } else {
                        commonHelper.sendJson(res, {}, constants.FALSE, 'User Registered Successfully', constants.SUCCESS, 1);
                    }
                });
            }
        }).catch((err) => {
            console.log('error registering user : ' + err + '\n');
        });
    });
}


/**
 * Name:login
 * Desc: This function helps users to login with username and password.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function login(req, res, next) {
    const userData = req.body;

    if (!userData || (!userData.username && !userData.email) || !userData.password) {
        commonHelper.sendJson(res, {}, constants.TRUE, 'Please enter all the required fields!!!', constants.SUCCESS, 1);
        return;
    }

    client.then((client) => {
        let db = client.db('local');
        let users = db.collection('users');
        let jsonVal = {};
        jsonVal = userData.email ? { email: userData.email } : { userData: userData.userData };
        new Promise((resolve, reject) => {
            users.findOne(jsonVal, (err, res) => {
                if (err) {
                    reject();
                } else {
                    resolve(res);
                }
            });
        }).then((data) => {
            if (!data) {
                commonHelper.sendJson(res, {}, constants.TRUE, 'User Does not exsists. Please register first', constants.SUCCESS, 1);
                return;
            } else {
                if (bcrypt.compareSync(userData.password, data.password)) {
                    const payload = {
                        id: data.userId,
                        email: data.email,
                        username: data.username
                    };
                    const accessToken = jwtService.getAccessToken(payload);
                    //console.log(jwtService.getRefreshToken(payload, client));
                    jwtService.getRefreshToken(payload, client).then(refreshToken => {
                        commonHelper.sendJson(res, { accessToken: accessToken, refreshToken: refreshToken, ...data }, constants.FALSE, 'Logged in Successfully', constants.SUCCESS, 1);
                        return;
                    });
                } else {
                    commonHelper.sendJson(res, {}, constants.TRUE, 'Password does not match', constants.SUCCESS, 1);
                    return;
                }
            }
        }).catch(err => {
            console.log("error in login : " + err);
        });
    });
}


/**
 * Name:refreshToken
 * Desc: This function helps users to update token after 15 mins.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

async function refreshToken(req, res, next) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        commonHelper.sendJson(res, {}, constants.TRUE, 'Access is forbidden', constants.ACCESS_FAIL, 1);
        return;
    }

    try {
        client.then(client => {
            let db = client.db('local');
            let users = db.collection('users');
            // get decoded data
            const decodedToken = jwt.verify(refreshToken, config[constants.env].secret);
            //console.log(decodedToken);
            // find the user in the user table
            new Promise((resolve, reject) => {
                users.findOne({ userId: decodedToken.user.id }, function(err, data) {
                    if (err)
                        reject('Access forbidden');
                    else
                        resolve(data);
                });
            }).then(user => {
                //console.log(user);
                // get all user's refresh tokens from DB
                return new Promise((resolve, reject) => {
                    let tokens = db.collection('tokens');
                    tokens.find({ userId: user.userId }).toArray(function(err, data) {
                        if (err)
                            reject(err);
                        else
                            resolve(data);
                    });
                });
            }).then(allRefreshTokens => {
                if (!allRefreshTokens || !allRefreshTokens.length) {
                    throw new Error('No Refresh Token Exists');
                }

                let currentRefreshToken = 0;
                allRefreshTokens.forEach(element => {
                    currentRefreshToken = element.token.localeCompare(refreshToken);
                });
                //console.log(currentRefreshToken);
                if (currentRefreshToken !== 0) {
                    throw new Error('Refresh token is wrong');
                }
                // user's data for new tokens
                const payload = {
                    id: decodedToken.user.id,
                    email: decodedToken.user.email,
                    username: decodedToken.user.username
                };

                // get new refresh and access token
                const newRefreshToken = jwtService.getUpdatedRefreshToken(refreshToken, payload);
                const newAccessToken = jwtService.getAccessToken(payload);

                commonHelper.sendJson(res, {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }, constants.FALSE, 'Token provided successfully', constants.SUCCESS, 1);
            });
        });
    } catch (err) {
        const message = (err && err.message) || err;
        commonHelper.sendJson(res, {}, constants.TRUE, message, constants.ACCESS_FAIL, 1);
        return;
    }
}