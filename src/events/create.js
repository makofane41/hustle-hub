const express = require('express')
const jwt = require('jsonwebtoken')
const eventRouter = express.Router()
const mysql = require('mysql')


///database connection
const con = mysql.createConnection({
  host              : 'us-cdbr-east-06.cleardb.net',
  user              : 'bf66cd93ed1528',
  password          : '0865175e',
  database          : 'heroku_12a464313c3566d'
});


//adding event Logic
eventRouter.post("/create/event/", function(req, res) {
const { token } = req.headers;


jwt.verify(token,"My Seckret Key", function(err, decoded) {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    } else {
      const { uid } = decoded;
      const { event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured } = req.body;
  
      con.query(
        "INSERT INTO event (event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured,uid) VALUES (?, ?,?, ?, ?, ?, ?, ?)",
        [event_name, event_category, event_date, event_ticket_prices, available_space, venue_and_time, featured,uid],
        function(error, results, fields) {
          if (error) {
            res.status(500).send({ error: "Something went wrong" });
          } else {
            res.status(200).send({ message: "Event sucessfully added" });
          }
        }
      );
    }
  });
});

module.exports = eventRouter;
