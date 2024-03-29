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

//cors
app.use(cors());



//user-function calling routes
const userRegister = require('./src/user_function/user_register')
const user_login = require('./src/user_function/authLogin')
const verifyOTP = require('./src/user_function/use_register_otp')
const forgottenPasswd = require('./src/user_function/forgottenpassd')

//hustler-function calling routes
const RegisterBusiness = require('./src/hustler_function/register_business')

//calling event functionality routes
const create_eventRouter = require('./src/events/create')
const getEvents = require('./src/events/getEvents')

//calling service functionality routes
const serviceRouter = require('./src/services/create')
const getServices = require('./src/services/getServices')

//calling products functionallity routes
const createProduct = require('./src/products/create')
const getProducts = require('./src/products/getProducts')

//user_fucntion
app.use('/user/',userRegister)
app.use('/user/',user_login)
app.use('/user/',verifyOTP)
app.use('/user/',forgottenPasswd)

//vendor || hustler functionality 
app.use('/vendor/',RegisterBusiness)


//events-fucntionalits (CRUD)
app.use('/event/',create_eventRouter)
app.use('/event/',getEvents)


//app-use services 
app.use('/service/',serviceRouter)
app.use('/service/',getServices)


//app-use products
app.use('/product/',createProduct)
app.use('/product/',getProducts)




module.exports.handler = serverless(app);
