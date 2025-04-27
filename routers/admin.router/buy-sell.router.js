const express = require("express");
const {
  getBuySell,
  changeUserProductStatus,
  getUserProductDetails,
  filteringUserProduct,
  getUserProductCategory,
  addUserProductCategory,
  editUserProductCategory,
  deleteUserProductCategory,
  getUserProductSubCategory,
  addUserProductSubCategory,
  editUserProductSubCategory,
  deleteUserProductSubCategory,
  deleteBuySell,
} = require("../../controllers/buy-sell.controller");
const buySellRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

buySellRouter.get("/buy-sell", getBuySell);
buySellRouter.post(
  "/change-user-product-status/:id",
  upload.none(),
  changeUserProductStatus
);
buySellRouter.get("/user-product-details/:id", getUserProductDetails);
buySellRouter.post("/buy-sell", upload.none(), filteringUserProduct);
buySellRouter.get("/user-product-category", getUserProductCategory);
buySellRouter.post(
  "/add-user-product-category",
  upload.none(),
  addUserProductCategory
);
buySellRouter.post(
  "/edit-user-product-category/:id",
  upload.none(),
  editUserProductCategory
);
buySellRouter.get(
  "/delete-user-product-category/:id",
  deleteUserProductCategory
);
buySellRouter.get("/user-product-sub-category/:id", getUserProductSubCategory);
buySellRouter.post(
  "/add-user-product-sub-category/:id",
  upload.none(),
  addUserProductSubCategory
);
buySellRouter.post(
  "/edit-user-product-sub-category/:id",
  upload.none(),
  editUserProductSubCategory
);
buySellRouter.get(
  "/delete-user-product-sub-category",
  deleteUserProductSubCategory
);

buySellRouter.get("/delete-user-product/:id", deleteBuySell);

module.exports = buySellRouter;
