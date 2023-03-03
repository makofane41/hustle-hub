const express = require('express');
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const nodemailer = require('nodemailer');
const UserRegister = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql')


//database connection
const con = mysql.createConnection({
  host              : 'us-cdbr-east-06.cleardb.net',
  user              : 'bf66cd93ed1528',
  password          : '0865175e',
  database          : 'heroku_12a464313c3566d'
});

//nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'makofane411@gmail.com',
        pass: 'ewkczsgvgzubiqob'
    }
});
//database configurations

UserRegister.post('/user/auth/register', (req, res) => {
    
    const verified = "false";
    const role =  "user";

    const { fname,lname, email, password,} = req.body;
    const otp = Math.floor(Math.random() * 1000000); // Generate a random OTP
    const expirationTime = 15; // OTP expiration time in minutes
    const timestamp = Date.now(); // Timestamp of when the OTP was generated

   //message start
    const message = `Dear ${fname} ${lname},

    Thank you for Registering Account with Us on HustleHub

    Your One Time Password (OTP) is: ${otp}

    Please use this OTP to verify your email address and complete the registration process.

    This OTP is only valid for the next 15 minutes. If you did not initiate this registration, please ignore this email.

    Thank you for choosing our service.

    Best regards,
    HustleHub Pty(Ltd)`;

    //message start end
    const hashpassword = bcrypt.hashSync(password, 10);

    //check if uer exist
    var check ='select * from user where email = ?;';
    con.query(check,[email], function(err, result, fields){
      if(err) throw err;
      if(result.length > 0){


        return res.status(200).json({
          message: 'User with this email '+ email + 'Exist'
        });
      }
      else{

     //query to insert on the database
     var sql = 'insert into user (fname,lname,email,password,role,verified,otp,expirationTime,timestamp) values(?,?,?,?,?,?,?,?,?);'
        con.query(sql,[fname,lname,email,hashpassword,role,verified,otp,expirationTime,timestamp], function(err, result, fields){
          
          //sendint otp
          if(err) throw err;
          transporter.sendMail({
            from: 'makofane411@gmail.com',
            to: email,
            subject: 'Complete Your HustleHub verification',
            text: `${message}`
        });  
        return res.status(200).json({ message: 'verify the OTP on ' + email });
         
        });
      }
    });


});

module.exports = UserRegister;