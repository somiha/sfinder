const express = require("express");
const {
  getNotice,
  addNotice,
  deleteNotice,
  editNotice,
} = require("../../controllers/notice.controller");
const noticeRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

noticeRouter.get("/notice", getNotice);
noticeRouter.post("/add-notice", upload.none(), addNotice);
noticeRouter.get("/delete-notice/:id", deleteNotice);
noticeRouter.post("/edit-notice/:id", upload.none(), editNotice);

module.exports = noticeRouter;
