const express = require('express');
const { crypt, port_no } = require('./config/constants');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./auth/verifyToken');
const indexRouter = require('./router/index');

var app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({
    limit: '20mb',
    extended: false
}));
app.use(auth.verifyToken);

app.use('/', indexRouter);
app.listen(port_no, (err) => {
    if (err) console.log("Unable to start server");
    else console.log(`Algo8 Server is up on port ${port_no}!`);
});