const express = require("express");
const {
  getChatAlerts,
  updateChatAlert,
} = require("../../controllers/chat-alert.controller");
const alertRouter = express.Router();

alertRouter.get("/chat-alert", getChatAlerts);
alertRouter.post("/edit-chat-alert", updateChatAlert);

module.exports = alertRouter;
