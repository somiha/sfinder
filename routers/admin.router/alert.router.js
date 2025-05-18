const express = require("express");
const {
  getChatAlerts,
  updateChatAlert,
} = require("../../controllers/chat-alert.controller");
const isLogged = require("../../middlewares/isLogin");
const alertRouter = express.Router();

alertRouter.get("/chat-alert", isLogged, getChatAlerts);
alertRouter.post("/edit-chat-alert", isLogged, updateChatAlert);

module.exports = alertRouter;
