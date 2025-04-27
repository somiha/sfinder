const express = require("express");
const {
  getFileSystem,
  addMobileCompany,
  editMobileCompany,
  deleteMobileCompany,
  getMainFolder,
  addMainFolder,
  editMainFolder,
  deleteMainFolder,
  getSubFolder,
  addSubFolder,
  editSubFolder,
  deleteSubFolder,
  getExtraFolder,
  addExtraFolder,
  editExtraFolder,
  deleteExtraFolder,
  getFiles,
  addFile,
  editFile,
  deleteFile,
} = require("../../controllers/file-system.controller");
const fileSystemRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

fileSystemRouter.get("/file-system", getFileSystem);
fileSystemRouter.post(
  "/add-mobile-company",
  upload.single("mobile_company_image"),
  addMobileCompany
);
fileSystemRouter.post(
  "/edit-mobile-company/:id",
  upload.single("mobile_company_image"),
  editMobileCompany
);
fileSystemRouter.get("/delete-mobile-company/:id", deleteMobileCompany);
fileSystemRouter.get("/main-folder/:id", getMainFolder);
fileSystemRouter.post("/add-main-folder", upload.none(), addMainFolder);
fileSystemRouter.post("/edit-main-folder/:id", upload.none(), editMainFolder);
fileSystemRouter.get("/delete-main-folder", deleteMainFolder);
fileSystemRouter.get("/sub-folder/:id", getSubFolder);
fileSystemRouter.post("/add-sub-folder/:id", upload.none(), addSubFolder);
fileSystemRouter.post("/edit-sub-folder", upload.none(), editSubFolder);
fileSystemRouter.get("/delete-sub-folder", deleteSubFolder);
fileSystemRouter.get("/extra-folder/:id", getExtraFolder);
fileSystemRouter.post("/add-extra-folder/:id", upload.none(), addExtraFolder);
fileSystemRouter.post("/edit-extra-folder", upload.none(), editExtraFolder);
fileSystemRouter.get("/delete-extra-folder", deleteExtraFolder);
fileSystemRouter.get("/files/:id", getFiles);
fileSystemRouter.post("/add-file/:id", upload.single("file"), addFile);
fileSystemRouter.post("/edit-file", upload.single("file"), editFile);
fileSystemRouter.get("/delete-file", deleteFile);

module.exports = fileSystemRouter;
