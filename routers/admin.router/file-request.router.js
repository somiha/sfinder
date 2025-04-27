const express = require("express");
const {
  getFileRequest,
  deleteFileRequest,
  changeStatus,
} = require("../../controllers/file-request.controller");
const fileRequestRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

fileRequestRouter.get("/file-request", getFileRequest);
fileRequestRouter.get("/delete-file-request/:id", deleteFileRequest);
fileRequestRouter.post(
  "/change-file-request-status",
  upload.none(),
  changeStatus
);

module.exports = fileRequestRouter;
