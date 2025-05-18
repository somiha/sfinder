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

fileSystemRouter.get("/file-system", isLogged, getFileSystem);
fileSystemRouter.post(
  "/add-mobile-company",
  isLogged,
  upload.single("mobile_company_image"),
  addMobileCompany
);
fileSystemRouter.post(
  "/edit-mobile-company/:id",
  isLogged,
  upload.single("mobile_company_image"),
  editMobileCompany
);
fileSystemRouter.get(
  "/delete-mobile-company/:id",
  isLogged,
  deleteMobileCompany
);
fileSystemRouter.get("/main-folder/:id", isLogged, getMainFolder);
fileSystemRouter.post(
  "/add-main-folder",
  isLogged,
  upload.none(),
  addMainFolder
);
fileSystemRouter.post(
  "/edit-main-folder/:id",
  isLogged,
  upload.none(),
  editMainFolder
);
fileSystemRouter.get("/delete-main-folder", isLogged, deleteMainFolder);
fileSystemRouter.get("/sub-folder/:id", isLogged, getSubFolder);
fileSystemRouter.post(
  "/add-sub-folder/:id",
  isLogged,
  upload.none(),
  addSubFolder
);
fileSystemRouter.post(
  "/edit-sub-folder",
  isLogged,
  upload.none(),
  editSubFolder
);
fileSystemRouter.get("/delete-sub-folder", isLogged, deleteSubFolder);
fileSystemRouter.get("/extra-folder/:id", isLogged, getExtraFolder);
fileSystemRouter.post(
  "/add-extra-folder/:id",
  isLogged,
  upload.none(),
  addExtraFolder
);
fileSystemRouter.post(
  "/edit-extra-folder",
  isLogged,
  upload.none(),
  editExtraFolder
);
fileSystemRouter.get("/delete-extra-folder", isLogged, deleteExtraFolder);
fileSystemRouter.get("/files/:id", isLogged, getFiles);
fileSystemRouter.post(
  "/add-file/:id",
  isLogged,
  upload.single("file"),
  addFile
);
fileSystemRouter.post("/edit-file", isLogged, upload.single("file"), editFile);
fileSystemRouter.get("/delete-file", isLogged, deleteFile);

module.exports = fileSystemRouter;
