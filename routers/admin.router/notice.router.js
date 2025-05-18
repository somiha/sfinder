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

noticeRouter.get("/notice", isLogged, getNotice);
noticeRouter.post("/add-notice", isLogged, upload.none(), addNotice);
noticeRouter.get("/delete-notice/:id", isLogged, deleteNotice);
noticeRouter.post("/edit-notice/:id", isLogged, upload.none(), editNotice);

module.exports = noticeRouter;
