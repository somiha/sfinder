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

packageRouter.get("/packages", getPackages);
packageRouter.get("/package-info/:id", getPackageInfo);
packageRouter.post("/add-package-info/:id", upload.none(), addPackageInfo);
packageRouter.post("/edit-package-info", upload.none(), editPackageInfo);
packageRouter.get("/delete-package-info", upload.none(), deletePackageInfo);
packageRouter.post(
  "/add-package",
  upload.single("package_cover_image"),
  addPackage
);
packageRouter.post(
  "/edit-package/:id",
  upload.single("package_cover_image"),
  editPackage
);
packageRouter.get("/delete-package/:id", deletePackage);

module.exports = packageRouter;
