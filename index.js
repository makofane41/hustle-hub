const serverless = require("serverless-http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//settings
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())

//local
//const port = process.env.PORT || 5003;

//test calling routes
const userTest = require('./src/user_function/user_app')
const hustler = require('./src/hustler_function/hustler_app')

//user-function calling routes
const userRegister = require('./src/user_function/user_register')

//test
app.use('/',userTest)
app.use('/',hustler)


//user_fucntion
app.use('/v1/',userRegister)



module.exports.handler = serverless(app);
