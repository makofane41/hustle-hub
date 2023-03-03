const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const user_login = express.Router();
const mysql = require('mysql')

//database connection
const con = mysql.createConnection({
  host              : 'us-cdbr-east-06.cleardb.net',
  user              : 'bf66cd93ed1528',
  password          : '0865175e',
  database          : 'heroku_12a464313c3566d'
});


user_login.post('/auth/login', (req, res) => {

  //user input email and password to login
  const email = req.body.email;
  const password = req.body.password;

  //quering the provided credentials
  con.query('SELECT * FROM user WHERE email = ?', [email], (error, results, fields) => {
    if (error) {
      res.status(500).send(error);  
    } 
    else {
           if (results.length > 0) {
               const user = results[0];

               //kind of unhanshing process here 
                bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                   res.status(500).send(err);
                }
                //if the user is not verified it doesnt allow auth
                if (user.verified==false){
                    res.status(401).json({ message: 'please verify your email to login' });
                }
   
                else 
                {
                    if (result) {
                    // Payload data from the user retrieved from the database
                    const payload = {
                        uid: user.uid,
                        fname: user.fname,
                        lname: user.lname,
                        email: user.email
                    };
                    
                    const token = jwt.sign(payload,"My Seckret Key", { expiresIn: '1h' });

                    res.send({ token });
                    } else {
                    res.status(401).json({message: 'Incorrect password'});
                    }
                }
                });
            } 
            else {
                res.status(401).json({message: 'User not found'});
            }
    }
  });
});

module.exports = user_login;
