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

orderRouter.get("/order", getOrder);
orderRouter.post("/edit-order/:id", upload.none(), editOrder);
orderRouter.get("/order-details/:id", getOrderDetails);
orderRouter.post("/order-filter", upload.none(), filterOrder);

module.exports = orderRouter;
