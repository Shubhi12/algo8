const { Connection } = require('./../connection');
const client = Connection.connectToMongo();
const constants = require('../config/constants');
const { parse } = require('json2csv');
const commonHelper = require('../helper/common');
const dateTime = require('node-datetime');



module.exports = { createCsv };

function createCsv(req, res, next) {

    var dt = dateTime.create();
    var uploadedDate = dt.now();
    client.then(client => {
        let db = client.db('local');
        new Promise((resolve, reject) => {
            db.collection('dummy').find().toArray((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        }).then(data => {
            let uploadData = {};
            uploadData.csv = parse(data);
            let randomNum = parseInt(Math.random() * 1000000);
            uploadData.key = uploadedDate + '_' + randomNum + '.csv';
            commonHelper.uploadDocOnS3(uploadData).then(awsPath => {
                commonHelper.sendJson(res, awsPath.csvPath, constants.FALSE, 'successfully uploaded csv on Aws', constants.SUCCESS, 1);
            });
        }).catch(err =>
            console.log('Error in Downloading Csv :' + err));
    });
}