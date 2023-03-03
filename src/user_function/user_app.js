
const express = require("express");
const userTest = express();

userTest.get("/user", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from user function!",
  });
});

module.exports = userTest;