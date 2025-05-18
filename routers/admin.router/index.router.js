const express = require("express");
const indexRouter = express.Router();
const isLogged = require("../../middlewares/isLogin");

indexRouter.get("/", isLogged, (req, res) => {
  console.log("1234567");
  if (req.is_logged_in) {
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin/login");
  }
});

module.exports = indexRouter;
