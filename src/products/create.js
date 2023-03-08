const express = require('express');
const jwt = require('jsonwebtoken');
const serviceRouter = express.Router();
const mysql = require('mysql');
const Joi = require('joi');

///database connection
const con = mysql.createPool({
  connectionLimit: 10, // maximum number of connections to create at once
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bf66cd93ed1528',
  password: '0865175e',
  database: 'heroku_12a464313c3566d'
});

// Products schema for validation
const serviceSchema = Joi.object({
  product_name: Joi.string().required(),
  product_category: Joi.string().required(),
  service_price: Joi.number().required(),
  description: Joi.string().required(),
  featured: Joi.boolean().required(),
});

// Adding service logic
serviceRouter.post('/create/service', function(req, res) {
  const { token } = req.headers;

  jwt.verify(token, 'My Seckret Key', function(err, decoded) {
    if (err) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const { uid } = decoded;
      const serviceData = req.body;

      // Validate request body against service schema
      const { error } = serviceSchema.validate(serviceData);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }

      // Add user ID to service data
      serviceData.uid = uid;

      con.query(
        'INSERT INTO service (service_name, service_category, service_price, description,  featured, uid) VALUES (?, ?, ?, ?, ?, ?)',
        [
          serviceData.service_name,
          serviceData.service_category,
          serviceData.service_price,
          serviceData.description,
          serviceData.featured,
          serviceData.uid,
        ],
        function(error, results, fields) {
          if (error) {
            res.status(500).send({ error: 'Something went wrong' });
          } else {
            res.status(200).send({ message: 'service successfully added' });
          }
        }
      );
    }
  });
});


//end db connection


module.exports = serviceRouter;
