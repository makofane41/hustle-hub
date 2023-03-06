const express = require('express');
const eventRouter = express.Router();
const db = require('../middleware/db');
const { authenticateToken } = require('../middleware/auth');

eventRouter.post('/', authenticateToken, (req, res) => {

  const { event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured } = req.body;
  const sql = 'INSERT INTO events (event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving event');
    } else {
      res.status(200).send('Event saved successfully');
    }
  });
});

module.exports = eventRouter;
