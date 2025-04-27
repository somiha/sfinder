const express = require("express");
const {
  getShop,
  getShopsByCategorySearch,
  getShopProductDetails,
  getProductCategory,
  addProductCategory,
  editProductCategory,
  deleteProductCategory,
  getAddProduct,
  addProduct,
  getEditProduct,
  editProduct,
  getSubCategory,
  addSubCategory,
  editProductSubCategory,
  deleteSubCategory,
  getShopProductTitle,
  addProductTitle,
  editProductTitle,
  deleteProductTitle,
  getShopProductImage,
  addProductImage,
  editProductImage,
  deleteProductImage,
  deleteShop,
} = require("../../controllers/shop.controller");
const shopRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

shopRouter.get("/shop", getShop);
shopRouter.post(
  "/shop-by-category-search",
  upload.none(),
  getShopsByCategorySearch
);
shopRouter.get("/shop-product-details/:id", getShopProductDetails);
shopRouter.get("/product-category", getProductCategory);
shopRouter.post("/add-product-category", upload.none(), addProductCategory);
shopRouter.post(
  "/edit-product-category/:id",
  upload.none(),
  editProductCategory
);
shopRouter.get("/delete-product-category/:id", deleteProductCategory);
shopRouter.get("/add-product", getAddProduct);
shopRouter.post(
  "/add-product",
  upload.fields([
    { name: "product_featured_image", maxCount: 1 },
    { name: "product_secondary_image", maxCount: 1 },
  ]),
  addProduct
);
shopRouter.get("/edit-shop-product/:id", getEditProduct);
shopRouter.post(
  "/edit-shop-product/:id",
  upload.fields([
    { name: "product_featured_image", maxCount: 1 },
    { name: "product_secondary_image", maxCount: 1 },
  ]),
  editProduct
);
shopRouter.get("/product-sub-category/:id", getSubCategory);
shopRouter.post("/add-product-sub-category/:id", upload.none(), addSubCategory);
shopRouter.post(
  "/edit-product-sub-category/:id",
  upload.none(),
  editProductSubCategory
);
shopRouter.get("/delete-product-sub-category", deleteSubCategory);
shopRouter.get("/shop-product-title/:id", getShopProductTitle);
shopRouter.post("/add-product-title/:id", upload.none(), addProductTitle);
shopRouter.post("/edit-product-title", upload.none(), editProductTitle);
shopRouter.get("/delete-product-title", deleteProductTitle);
shopRouter.get("/shop-product-image/:id", getShopProductImage);
shopRouter.post(
  "/add-product-image/:id",
  upload.single("product_image"),
  addProductImage
);
shopRouter.post(
  "/edit-product-image",
  upload.single("product_image"),
  editProductImage
);

shopRouter.get("/delete-product-image", deleteProductImage);
shopRouter.get("/delete-shop/:id", deleteShop);

module.exports = shopRouter;
