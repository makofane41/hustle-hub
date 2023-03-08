const express = require('express');
const jwt = require('jsonwebtoken');
const eventRouter = express.Router();
const mysql = require('mysql');
const Joi = require('joi');

///database connection
const con = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bf66cd93ed1528',
  password: '0865175e',
  database: 'heroku_12a464313c3566d'
});

// Event schema for validation
const eventSchema = Joi.object({
  event_name: Joi.string().required(),
  event_category: Joi.string().required(),
  event_date: Joi.date().required(),
  event_ticket_prices: Joi.array().items(Joi.number()).required(),
  available_space: Joi.number().required(),
  venue_and_time: Joi.string().required(),
  featured: Joi.boolean().required(),
});

// Adding event logic
eventRouter.post('/create/event', function(req, res) {
  const { token } = req.headers;

  jwt.verify(token, 'My Seckret Key', function(err, decoded) {
    if (err) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const { uid } = decoded;
      const eventData = req.body;

      // Validate request body against event schema
      const { error } = eventSchema.validate(eventData);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }

      // Add user ID to event data
      eventData.uid = uid;

      con.query(
        'INSERT INTO event (event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured, uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          eventData.event_name,
          eventData.event_category,
          eventData.event_date,
          JSON.stringify(eventData.event_ticket_prices),
          eventData.available_space,
          eventData.venue_and_time,
          eventData.featured,
          eventData.uid,
        ],
        function(error, results, fields) {
          if (error) {
            res.status(500).send({ error: 'Something went wrong' });
          } else {
            res.status(200).send({ message: 'Event successfully added' });
          }
        }
      );
    }
  });
});

module.exports = eventRouter;
