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

shopRouter.get("/shop", isLogged, getShop);
shopRouter.post(
  "/shop-by-category-search",
  isLogged,
  upload.none(),
  getShopsByCategorySearch
);
shopRouter.get("/shop-product-details/:id", isLogged, getShopProductDetails);
shopRouter.get("/product-category", isLogged, getProductCategory);
shopRouter.post(
  "/add-product-category",
  isLogged,
  upload.none(),
  addProductCategory
);
shopRouter.post(
  "/edit-product-category/:id",
  isLogged,
  upload.none(),
  editProductCategory
);
shopRouter.get("/delete-product-category/:id", isLogged, deleteProductCategory);
shopRouter.get("/add-product", isLogged, getAddProduct);
shopRouter.post(
  "/add-product",
  isLogged,
  upload.fields([
    { name: "product_featured_image", isLogged, maxCount: 1 },
    { name: "product_secondary_image", isLogged, maxCount: 1 },
  ]),
  addProduct
);
shopRouter.get("/edit-shop-product/:id", isLogged, getEditProduct);
shopRouter.post(
  "/edit-shop-product/:id",
  isLogged,
  upload.fields([
    { name: "product_featured_image", isLogged, maxCount: 1 },
    { name: "product_secondary_image", isLogged, maxCount: 1 },
  ]),
  editProduct
);
shopRouter.get("/product-sub-category/:id", isLogged, getSubCategory);
shopRouter.post(
  "/add-product-sub-category/:id",
  isLogged,
  upload.none(),
  addSubCategory
);
shopRouter.post(
  "/edit-product-sub-category/:id",
  isLogged,
  upload.none(),
  editProductSubCategory
);
shopRouter.get("/delete-product-sub-category", isLogged, deleteSubCategory);
shopRouter.get("/shop-product-title/:id", isLogged, getShopProductTitle);
shopRouter.post(
  "/add-product-title/:id",
  isLogged,
  upload.none(),
  addProductTitle
);
shopRouter.post(
  "/edit-product-title",
  isLogged,
  upload.none(),
  editProductTitle
);
shopRouter.get("/delete-product-title", isLogged, deleteProductTitle);
shopRouter.get("/shop-product-image/:id", isLogged, getShopProductImage);
shopRouter.post(
  "/add-product-image/:id",
  isLogged,
  upload.single("product_image"),
  addProductImage
);
shopRouter.post(
  "/edit-product-image",
  isLogged,
  upload.single("product_image"),
  editProductImage
);

shopRouter.get("/delete-product-image", isLogged, deleteProductImage);
shopRouter.get("/delete-shop/:id", isLogged, deleteShop);

module.exports = shopRouter;
