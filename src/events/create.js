const express = require('express');
const jwt = require('jsonwebtoken');
const create_eventRouter = express.Router();
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

// Event schema for validation
const eventSchema = Joi.object({
  event_name: Joi.string().required(),
  category_name: Joi.string().required(),
  event_date: Joi.date().required(),
  event_ticket_prices: Joi.number().required(),
  available_space:Joi.number().required(),
  venue_and_time:Joi.string().required(),
  featured:Joi.boolean().required(),
  description:Joi.string().required(),
});

// Adding Event logic
create_eventRouter.post('/create', function(req, res) {
  const { token } = req.headers;

  jwt.verify(token, 'My Seckret Key', function(err, decoded) {
    if (err) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const { uid } = decoded;
      const eventData = req.body;

      // Validate request body against Event schema
      const { error } = eventSchema.validate(eventData);
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

            //inserting the service information
            con.query(
              `INSERT INTO event (event_name, category_name, event_date, event_ticket_prices, available_space, venue_and_time, featured, business_id, description) VALUES (?, ?, ?, ?, ?,?,?,?,?)`,
              [

                eventData.event_name,
                eventData.category_name,
                eventData.event_date,
                eventData.event_ticket_prices,
                eventData.available_space,
                eventData.venue_and_time,
                eventData.featured,
                business_id,
                eventData.description
  
              ],
              function(error, results, fields) {
                if (error) {
                  res.status(500).send({ error: 'Something went wrong'});
                } else {
                  res.status(200).send({ message: 'event successfully added' });
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


module.exports = create_eventRouter;
