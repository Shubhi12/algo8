var express = require('express');
var router = express.Router();
const controller = require('../controller/loginOrRegisterController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('<p>HTML Data</p>');
});

router.post('/register', function(req, res, next) {
    controller.register(req, res, next);
});

router.post('/login', function(req, res, next) {
    controller.login(req, res, next);
});

router.post('/refreshToken', function(req, res, next) {
    controller.refreshToken(req, res, next);
});

module.exports = router;