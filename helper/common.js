module.exports = { sendJson };

function sendJson(res, data, error, message, statusCode, totalRecords) {
    return res.json({
        data,
        error,
        message,
        statusCode,
        totalRecords
    });
}