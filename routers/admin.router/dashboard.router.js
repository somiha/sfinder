const express = require("express");
const { getDashboard } = require("../../controllers/dashboard.controller");
const dashboardRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

dashboardRouter.get("/dashboard", isLogged, getDashboard);

module.exports = dashboardRouter;
