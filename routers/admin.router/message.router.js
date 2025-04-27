const express = require("express");
const {
  getMessage,
  deleteMessage,
  changeMessageStatus,
} = require("../../controllers/message.controller");
const messageRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

messageRouter.get("/message", getMessage);
messageRouter.get("/delete-message/:id", deleteMessage);
messageRouter.post(
  "/change-message-status",
  upload.none(),
  changeMessageStatus
);

module.exports = messageRouter;
