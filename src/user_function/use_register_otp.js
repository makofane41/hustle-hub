const express = require('express');
const e = require('express');
const verifyOTP = express.Router();
const mysql = require ('mysql');

//database connection
const con = mysql.createConnection({
    host              : 'us-cdbr-east-06.cleardb.net',
    user              : 'bf66cd93ed1528',
    password          : '0865175e',
    database          : 'heroku_12a464313c3566d'
  });

verifyOTP.post('/verifyotp', (req, res) => {
    const otp = req.body.otp;
    

    // Check if the OTP exists in the database
    con.query(`SELECT * FROM user WHERE  otp = ${otp}`, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            // OTP is valid then update status to 1
            const user = results[0];
            const setTrue =true;
            const resetOTP = 0;
            
            con.query(`UPDATE user SET verified = ${setTrue} ,  otp = ${resetOTP} WHERE uid = ${user.uid}`,(error,results)=>{
                 if(error) throw error;
                 res.status(200).json({
                    message: 'Successfully verified'
                });
            })
            
           
        } else {
            // OTP is not valid
            res.status(401).json({
                message: 'OTP is not valid'
            });
        }
    });
});

module.exports = verifyOTP;

