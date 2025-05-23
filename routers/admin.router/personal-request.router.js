const express = require("express");
const {
  getPersonalRequest,
  deletePersonalRequest,
  changeStauts,
  deleteSelectedRequest,
} = require("../../controllers/personal-request.controller");
const personalRequestRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

personalRequestRouter.get("/personal-request", getPersonalRequest);
personalRequestRouter.get(
  "/delete-personal-request/:id",
  deletePersonalRequest
);
personalRequestRouter.post(
  "/change-personal-request-status",
  upload.none(),
  changeStauts
);
personalRequestRouter.post("/delete-selected-request", deleteSelectedRequest);
module.exports = personalRequestRouter;
