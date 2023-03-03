const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const forgottenPasswd = express.Router();
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

forgottenPasswd.post('/req/forgotpass/', (req, res) => {
    

    const {  email} = req.body;
    //genereta random to be used when reseting password

    const otp = Math.floor(Math.random() * 1000000); 
    const expirationTime = 15; 
    const timestamp = Date.now(); 

   //message start
    const message = `Dear Customer,

    Forgotten Password for ${email}

    Your One Time Password (OTP) is: ${otp}

    Please use this OTP to reset your password.

    This OTP is only valid for the next 15 minutes. If you did not initiate this , please ignore this email.

    Thank you for choosing our service.

    Best regards,
    HustleHub Pty(Ltd)`;
    //message start end
    

    //check if uer exist
    var check ='select * from user where email = ?;';
    con.query(check,[email], function(err, result, fields){
      if(err) throw err;
      if(result.length > 0){

        const user = result[0];

        //send otp
        transporter.sendMail({
            from: 'makofane411@gmail.com',
            to: email,
            subject: 'Complete Your HustleHub verification',
            text: `${message}`
        });  
       
        const fpasswd =true;
        con.query(`UPDATE user SET fpasswd = ${fpasswd} ,  otp = ${otp} WHERE uid = ${user.uid}`,(error,results)=>{
            if(error) throw error;

              res.status(200).json({
               message: 'Verify the OTP'
           });
       })
        
        
    
      }
      //exption
      else{
        res.status(401).json({message: 'no user with this email'});

      }
    });


});

forgottenPasswd.post('/forgotpasswd/new_passwd/',(req,res)=>{
    const {new_passwd, otp} =req.body;

     var fpasswd =true;
    //confirmin the otp and make sure that fpasswd was requested
    con.query( `SELECT * FROM user WHERE fpasswd = ${fpasswd} AND  otp = ${otp}`,(error,results)=>{
        if(error) throw error;
        if (results.length>0){
            const user= results[0]
            //apply changes to database
            var password = bcrypt.hashSync(new_passwd, 10);

            //change it to false for successfuly reset
             fpasswd =false;
             var otpset =0;
            //update database
            con.query( `UPDATE user SET password= "${password}",  otp = ${otpset}, fpasswd = ${fpasswd}  WHERE uid = ${user.uid}`,(error,results)=>{
                if(error) throw error;
                 
                res.status(200).json({message: 'sucessfully changed'});
                
            })
        }
        else{
            res.status(401).json({message: 'wrong OTP'});
        }
    })
})

module.exports =forgottenPasswd;