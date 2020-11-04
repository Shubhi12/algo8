var AWS = require('aws-sdk');
const config = require('../config/config.json');
const constants = require('../config/constants');
module.exports = { sendJson, uploadDocOnS3 };

function sendJson(res, data, error, message, statusCode, totalRecords) {
    return res.json({
        data,
        error,
        message,
        statusCode,
        totalRecords
    });
}

function uploadDocOnS3(data) {
    // console.log(data);
    // process.exit();
    return new Promise(function(resolve, reject) {
        //let bufferObject = new Buffer.from(JSON.stringify(data.csv));
        bucket = config[constants.env].AWS.BUCKET;
        accessKeyId = config[constants.env].AWS.AWS_ACCESS_KEY;
        secretAccessKey = config[constants.env].AWS.AWS_SECRET_KEY;
        // make confige data.
        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });

        // get instance of S3.
        const s3 = new AWS.S3();
        // set params  data.
        const params = {
            // bucket name.
            Bucket: bucket,
            // image name
            Key: data.key,
            // csv data (buffer of csv).
            Body: data.csv,
            // Public read
            ACL: 'public-read',
            ContentEncoding: 'base64'
        };

        // define response data 
        let responseData = {};

        s3.putObject(params, function(error, response) {
            if (error) {
                reject(error);
            } else {
                let params = this.request.params;
                let region = this.request.httpRequest.region;
                let bucketPath = 's3://' + params.Bucket + '/' + params.Key;
                let csvPath = 'https://s3-' + region + '.amazonaws.com/' + params.Bucket + '/' + params.Key;
                // bucket path.
                responseData.bucketPath = bucketPath;
                // csv path
                responseData.csvPath = csvPath;
                console.log(responseData);
                // return response data.                      
                resolve(responseData);
            }
        });
    });
}