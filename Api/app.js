
const express = require('express');
const bodyParser = require("body-parser")
const app = express();
const cors = require('cors');
const compression = require('compression');

app.use(compression());

require('dotenv').config()

app.use(bodyParser.json({limit: '1000mb'})) 
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}))
app.use(cors());
var indexApi = require('./api/routes/index');

app.use('/api', indexApi);

app.use(express.static(__dirname+'/dist'));



app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.listen(process.env.PORT || 3000, () => {
    console.log("SERVER ON");
})
