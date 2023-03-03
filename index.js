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




//user-function calling routes
const userRegister = require('./src/user_function/user_register')
const user_login = require('./src/user_function/authLogin')
const verifyOTP = require('./src/user_function/use_register_otp')
const forgottenPasswd = require('./src/user_function/forgottenpassd')



//user_fucntion
app.use('/user/r/',userRegister)
app.use('/user/l/',user_login)
app.use('/user/',verifyOTP)
app.use('/user/passwd/',forgottenPasswd)



module.exports.handler = serverless(app);
