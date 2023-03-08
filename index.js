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

//hustler-function calling routes
const RegisterBusiness = require('./src/hustler_function/register_business')

//calling event functionality
const eventRouter = require('./src/events/create')

//calling service functionality routes
const serviceRouter = require('./src/services/create')

//user_fucntion
app.use('/user/r/',userRegister)
app.use('/user/l/',user_login)
app.use('/user/',verifyOTP)
app.use('/user/passwd/',forgottenPasswd)

//vendor || hustler functionality 
app.use('/vendor/',RegisterBusiness)

//events-fucntionalits (CRUD)
app.use('/event/',eventRouter)

//app-use services 
app.use('/service/',serviceRouter)




module.exports.handler = serverless(app);
