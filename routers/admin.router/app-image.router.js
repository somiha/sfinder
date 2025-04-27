const express = require("express");
const {
  getAppImage,
  addAppImage,
  editAppImage,
  deleteAppImage,
} = require("../../controllers/app-image.controller");
const appImageRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

appImageRouter.get("/app-image", isLogged, getAppImage);
appImageRouter.post(
  "/add-app-image",
  isLogged,
  upload.single("banner_image"),
  addAppImage
);
appImageRouter.post(
  "/edit-app-image",
  isLogged,
  upload.single("banner_image"),
  editAppImage
);
appImageRouter.get("/delete-app-image/:id", isLogged, deleteAppImage);

module.exports = appImageRouter;
