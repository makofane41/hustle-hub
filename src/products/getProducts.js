const express = require('express');
const getProducts = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Database connection
const con = mysql.createPool({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bf66cd93ed1528',
  password: '0865175e',
  database: 'heroku_12a464313c3566d',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

getProducts.get('/get', (req, res) => {
  const sqlQuery = 'SELECT * FROM product';
  con.query(sqlQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving data from database');
      return;
    }

    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      res.status(404).send('No products found');
    }
  });
});

module.exports = getProducts;
