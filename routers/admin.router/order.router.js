const express = require("express");
const {
  getOrder,
  editOrder,
  getOrderDetails,
  filterOrder,
} = require("../../controllers/order.controller");
const orderRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

orderRouter.get("/order", isLogged, getOrder);
orderRouter.post("/edit-order/:id", isLogged, upload.none(), editOrder);
orderRouter.get("/order-details/:id", isLogged, getOrderDetails);
orderRouter.post("/order-filter", isLogged, upload.none(), filterOrder);

module.exports = orderRouter;
