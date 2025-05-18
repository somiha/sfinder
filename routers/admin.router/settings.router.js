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

settingsRouter.get("/settings", isLogged, isLogged, getSettings);
settingsRouter.post(
  "/edit-social-media-info",
  isLogged,
  isLogged,
  upload.none(),
  editSocialMediaInfo
);

settingsRouter.post(
  "/edit-contact-us-info",
  isLogged,
  isLogged,
  upload.none(),
  editContactUsInfo
);

settingsRouter.post(
  "/edit-general-info",
  isLogged,
  isLogged,
  upload.fields([
    { name: "home_video_thumbnail_image", isLogged, maxCount: 1 },
    { name: "home_video", isLogged, maxCount: 1 },
  ]),
  editGenaralInfo
);

settingsRouter.post(
  "/add-alert",
  isLogged,
  isLogged,
  upload.fields([
    { name: "alert_image", isLogged, maxCount: 1 },
    { name: "alert_file", isLogged, maxCount: 1 },
  ]),
  addAlert
);
settingsRouter.post(
  "/edit-alert/:id",
  isLogged,
  isLogged,
  upload.fields([
    { name: "alert_image", isLogged, maxCount: 1 },
    { name: "alert_file", isLogged, maxCount: 1 },
  ]),
  editAlert
);
settingsRouter.get("/delete-alert/:id", isLogged, deleteAlert);

module.exports = settingsRouter;
