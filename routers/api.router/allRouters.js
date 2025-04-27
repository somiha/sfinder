const express = require("express");
const Router = express.Router();

const generalRouter = require("./genaral.router");
const registrationRouter = require("./registration.router");
const loginRouter = require("./login.router");
const bannerRouter = require("./banner.router");
const userRouter = require("./user.router");
const freelancerRouter = require("./freelancer.router");
const mainShopRouter = require("./main-shop.router");
const userProductRouter = require("./user-product.router");
const courseRouter = require("./course.router");
const fileSystemRouter = require("./file-system.router");
const packageRouter = require("./package.router");
const alertRouter = require("./alert.router");
const sponsorRouter = require("./sponsor.router");

Router.use(generalRouter);
Router.use(registrationRouter);
Router.use(loginRouter);
Router.use(bannerRouter);
Router.use(userRouter);
Router.use(freelancerRouter);
Router.use(mainShopRouter);
Router.use(userProductRouter);
Router.use(courseRouter);
Router.use(fileSystemRouter);
Router.use(packageRouter);
Router.use(alertRouter);
Router.use(sponsorRouter);

module.exports = Router;
