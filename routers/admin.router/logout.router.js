const express = require("express");
const logoutRouter = express.Router();

logoutRouter.get("/log-out", (req, res) => {
  res.clearCookie("userId");
  req.is_logged_in = false;
  // delete session and cookies
  res.clearCookie("is_logged_in");

  res.redirect("/admin/login");
});

module.exports = logoutRouter;
