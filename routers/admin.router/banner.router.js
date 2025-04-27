const express = require("express");
const {
  getBanner,
  addBanner,
  editBanner,
  deleteBanner,
} = require("../../controllers/banner.controller");
const bannerRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

bannerRouter.get("/banner", isLogged, getBanner);
bannerRouter.post(
  "/add-banner",
  isLogged,
  upload.single("banner_image"),
  addBanner
);
bannerRouter.post(
  "/edit-banner",
  isLogged,
  upload.single("banner_image"),
  editBanner
);
bannerRouter.get("/delete-banner/:id", isLogged, deleteBanner);

module.exports = bannerRouter;
