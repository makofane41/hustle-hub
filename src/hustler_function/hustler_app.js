
const express = require("express");
const hustler = express();

hustler.get("/hustler", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from hustler function!",
  });
});

module.exports = hustler;