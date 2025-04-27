const express = require("express");
const alertRouter = express.Router();
const db = require("../../config/database");

alertRouter.get("/get-chat-warning", (req, res) => {
  db.query("SELECT * FROM chat_alert", (error, result) => {
    if (!error) {
      if (result && result[0]) {
        res.send({
          status: "success",
          message: "Get chat alert successfully",
          data: result[0],
        });
      } else {
        res.send({
          status: "success",
          message: "Get chat alert successfully",
          data: null,
        });
      }
    } else {
      res.send(error);
    }
  });
});

module.exports = alertRouter;
