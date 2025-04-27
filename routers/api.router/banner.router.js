const express = require("express");
const bannerRouter = express.Router();
const db = require("../../config/database");

bannerRouter.get("/banners", (req, res) => {
  db.query("SELECT * FROM banners", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get banners successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

module.exports = bannerRouter;
