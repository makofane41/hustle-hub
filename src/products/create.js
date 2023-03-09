const express = require('express');
const jwt = require('jsonwebtoken');
const createProduct = express.Router();
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
const productSchema = Joi.object({
  product_name: Joi.string().required(),
  product_description: Joi.string().required(),
  product_price: Joi.number().required(),
  category_name: Joi.string().required(),

});
// Adding products logic
createProduct.post('/create', function(req, res) {
  const { token } = req.headers;

  jwt.verify(token, 'My Seckret Key', function(err, decoded) {
    if (err) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const { uid } = decoded;
      const productData = req.body;

      // Validate request body against service schema
      const { error } = productSchema.validate(productData);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }
       //getting the business id and set some posting restriction
       con.query(`SELECT * FROM business WHERE uid=${uid}`,function(error,results,fields){
         if(error){
          res.status(500).send({
            error: 'Something went wrong'
          });

         }else if(results.length>0){
            const business_info = results[0];

            //grab the business_id
            const business_id = business_info.bid

            //inserting the products information
            con.query(
              `INSERT INTO product (product_name, product_description, product_price, business_id,  category_name) VALUES (?, ?, ?, ?, ?)`,
              [
                productData.product_name,
                productData.product_description,
                productData.product_price,
                business_id,
                productData.category_name,

              ],
              function(error, results, fields) {
                if (error) {
                  res.status(500).send({ error: 'Something went wrong'});
                } else {
                  res.status(200).send({ message: 'product successfully added' });
                }
              }
            );

         }else{
          res.status(500).send({ message: 'vendor subscription invalid' });
         }
       });
      
    }
  });
});

//end db connection
module.exports = createProduct;
