const express = require("express");
const {
  getFileRequest,
  deleteFileRequest,
  changeStatus,
} = require("../../controllers/file-request.controller");
const fileRequestRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

fileRequestRouter.get("/file-request", isLogged, getFileRequest);
fileRequestRouter.get("/delete-file-request/:id", isLogged, deleteFileRequest);
fileRequestRouter.post(
  "/change-file-request-status",
  isLogged,
  upload.none(),
  changeStatus
);

module.exports = fileRequestRouter;
