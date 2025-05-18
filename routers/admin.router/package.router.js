const express = require("express");
const {
  getPackages,
  getPackageInfo,
  addPackageInfo,
  editPackageInfo,
  deletePackageInfo,
  addPackage,
  editPackage,
  deletePackage,
} = require("../../controllers/package.controller");
const packageRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

packageRouter.get("/packages", isLogged, getPackages);
packageRouter.get("/package-info/:id", isLogged, getPackageInfo);
packageRouter.post(
  "/add-package-info/:id",
  isLogged,
  upload.none(),
  addPackageInfo
);
packageRouter.post(
  "/edit-package-info",
  isLogged,
  upload.none(),
  editPackageInfo
);
packageRouter.get(
  "/delete-package-info",
  isLogged,
  upload.none(),
  deletePackageInfo
);
packageRouter.post(
  "/add-package",
  isLogged,
  upload.single("package_cover_image"),
  addPackage
);
packageRouter.post(
  "/edit-package/:id",
  isLogged,
  upload.single("package_cover_image"),
  editPackage
);
packageRouter.get("/delete-package/:id", isLogged, deletePackage);

module.exports = packageRouter;
