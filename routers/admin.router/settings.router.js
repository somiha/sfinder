const express = require("express");
const settingsRouter = express.Router();
const {
  getSettings,
  editSocialMediaInfo,
  editGenaralInfo,
  addAlert,
  editAlert,
  deleteAlert,
  editContactUsInfo,
} = require("../../controllers/settings.controller");
const isLogged = require("../../middlewares/isLogin");
const upload = require("../../config/multer");

settingsRouter.get("/settings", isLogged, getSettings);
settingsRouter.post(
  "/edit-social-media-info",
  isLogged,
  upload.none(),
  editSocialMediaInfo
);

settingsRouter.post(
  "/edit-contact-us-info",
  isLogged,
  upload.none(),
  editContactUsInfo
);

settingsRouter.post(
  "/edit-general-info",
  isLogged,
  upload.fields([
    { name: "home_video_thumbnail_image", maxCount: 1 },
    { name: "home_video", maxCount: 1 },
  ]),
  editGenaralInfo
);

settingsRouter.post(
  "/add-alert",
  isLogged,
  upload.fields([
    { name: "alert_image", maxCount: 1 },
    { name: "alert_file", maxCount: 1 },
  ]),
  addAlert
);
settingsRouter.post(
  "/edit-alert/:id",
  isLogged,
  upload.fields([
    { name: "alert_image", maxCount: 1 },
    { name: "alert_file", maxCount: 1 },
  ]),
  editAlert
);
settingsRouter.get("/delete-alert/:id", deleteAlert);

module.exports = settingsRouter;
