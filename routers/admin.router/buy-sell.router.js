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

buySellRouter.get("/buy-sell", isLogged, getBuySell);
buySellRouter.post(
  "/change-user-product-status/:id",
  isLogged,
  upload.none(),
  changeUserProductStatus
);
buySellRouter.get("/user-product-details/:id", isLogged, getUserProductDetails);
buySellRouter.post("/buy-sell", isLogged, upload.none(), filteringUserProduct);
buySellRouter.get("/user-product-category", isLogged, getUserProductCategory);
buySellRouter.post(
  "/add-user-product-category",
  isLogged,
  upload.none(),
  addUserProductCategory
);
buySellRouter.post(
  "/edit-user-product-category/:id",
  isLogged,
  upload.none(),
  editUserProductCategory
);
buySellRouter.get(
  "/delete-user-product-category/:id",
  isLogged,
  deleteUserProductCategory
);
buySellRouter.get(
  "/user-product-sub-category/:id",
  isLogged,
  getUserProductSubCategory
);
buySellRouter.post(
  "/add-user-product-sub-category/:id",
  isLogged,
  upload.none(),
  addUserProductSubCategory
);
buySellRouter.post(
  "/edit-user-product-sub-category/:id",
  isLogged,
  upload.none(),
  editUserProductSubCategory
);
buySellRouter.get(
  "/delete-user-product-sub-category",
  isLogged,
  deleteUserProductSubCategory
);

buySellRouter.get("/delete-user-product/:id", isLogged, deleteBuySell);

module.exports = buySellRouter;
