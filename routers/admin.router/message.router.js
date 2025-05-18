const express = require("express");
const {
  getMessage,
  deleteMessage,
  changeMessageStatus,
} = require("../../controllers/message.controller");
const messageRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

messageRouter.get("/message", isLogged, getMessage);
messageRouter.get("/delete-message/:id", isLogged, deleteMessage);
messageRouter.post(
  "/change-message-status",
  isLogged,
  upload.none(),
  changeMessageStatus
);

module.exports = messageRouter;
