const express = require("express");
const {
  getIc,
  addIc,
  editIc,
  deleteIc,
} = require("../../controllers/ic.controller");
const icRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

icRouter.get("/ic", getIc);
icRouter.post("/add-ic", upload.none(), addIc);
icRouter.post("/edit-ic/:id", upload.none(), editIc);
icRouter.get("/delete-ic/:id", upload.none(), deleteIc);

module.exports = icRouter;
