const jwt = require('jsonwebtoken');
const config = require('../config/config');
const commonHelper = require('../helper/common');
const constants = require('../config/constants');
module.exports = {
    verifyToken: verifyToken
};
/**
 * Name:verifyToken
 * Desc: This function help to verify token for valid users.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyToken(req, res, next) {
    if (req.url == '/login' || req.url == '/register' || req.url == '/refreshToken') {
        next();
    } else {
        var token = req.headers.authorization || req.query.token || req.body.token || req.headers.Authorization;
        var data = {};
        if (token) {
            jwt.verify(token, config[constants.env].secret, function(error, response) {
                if (error) {
                    commonHelper.sendJson(res, data, constants.TRUE, 'Failed to authenticate token.', constants.AUTH_FAIL, 0);
                } else {
                    req.uid = response.userId;
                    next();
                }
            });
        } else {
            commonHelper.sendJson(res, data, constants.TRUE, 'Failed to authenticate token.', constants.AUTH_FAIL, 0);
        }
    }
}