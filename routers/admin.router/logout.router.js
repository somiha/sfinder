const express = require("express");
const logoutRouter = express.Router();

logoutRouter.get("/log-out", (req, res) => {
  res.clearCookie("userId");
  req.login_status = false;
  res.redirect("/admin");
});

module.exports = logoutRouter;
