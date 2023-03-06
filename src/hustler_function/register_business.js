const express = require('express')
const jwt = require('jsonwebtoken')
const RegisterBusiness = express.Router()
const mysql = require('mysql')


///database connection
const con = mysql.createConnection({
  host              : 'us-cdbr-east-06.cleardb.net',
  user              : 'bf66cd93ed1528',
  password          : '0865175e',
  database          : 'heroku_12a464313c3566d'
});


//adding business Logic
RegisterBusiness.post("/signup-business", function(req, res) {
const { token } = req.headers;


jwt.verify(token,"My Seckret Key", function(err, decoded) {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    } else {
      const { uid } = decoded;
      const { businessName, address,contact,businessType,businessLocation,cid,subid,paymentStatus,Lat,Lng } = req.body;
  
      con.query(
        "INSERT INTO business (businessName, address, contact, businessType, businessLocation, cid, uid, subid, paymentStatus, Lat, Lng) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [businessName, address, contact, businessType, businessLocation, cid, uid, subid, paymentStatus, Lat, Lng],
        function(error, results, fields) {
          if (error) {
            res.status(500).send({ error: "Something went wrong" });
          } else {
            res.send({ message: "Complete by making Payment" });
          }
        }
      );
    }
  });
});

module.exports = RegisterBusiness;