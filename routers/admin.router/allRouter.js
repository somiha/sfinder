const express = require("express");
const Router = express.Router();

const indexRouter = require("./index.router");
const loginRouter = require("./login.router");
const logoutRouter = require("./logout.router");
const userRouter = require("./user.router");
const bannerRouter = require("./banner.router");
const settingsRouter = require("./settings.router");
const noticeRouter = require("./notice.router");
const messageRouter = require("./message.router");
const dailyUpdateRouter = require("./daily-update.router");
const fileRequestRouter = require("./file-request.router");
const icRouter = require("./ic.router");
const buySellRouter = require("./buy-sell.router");
const freelancerRouter = require("./freelancer.router");
const shopRouter = require("./shop.router");
const orderRouter = require("./order.router");
const packageRouter = require("./package.router");
const courseRouter = require("./course.router");
const fileSystemRouter = require("./file-system.router");
const personalRequestRouter = require("./personal-request.router");
const appImageRouter = require("./app-image.router");
const alertRouter = require("./alert.router");
const divisionRouter = require("./division.router");
const districtRouter = require("./district.router");
const dashboardRouter = require("./dashboard.router");
const sponsorRouter = require("./sponsor.router");

Router.use(indexRouter);
Router.use(loginRouter);
Router.use(userRouter);
Router.use(logoutRouter);
Router.use(bannerRouter);
Router.use(settingsRouter);
Router.use(noticeRouter);
Router.use(messageRouter);
Router.use(dailyUpdateRouter);
Router.use(fileRequestRouter);
Router.use(icRouter);
Router.use(buySellRouter);
Router.use(freelancerRouter);
Router.use(shopRouter);
Router.use(orderRouter);
Router.use(packageRouter);
Router.use(courseRouter);
Router.use(fileSystemRouter);
Router.use(personalRequestRouter);
Router.use(appImageRouter);
Router.use(alertRouter);
Router.use(divisionRouter);
Router.use(districtRouter);
Router.use(dashboardRouter);
Router.use(sponsorRouter);

module.exports = Router;
