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

icRouter.get("/ic", isLogged, getIc);
icRouter.post("/add-ic", isLogged, upload.none(), addIc);
icRouter.post("/edit-ic/:id", isLogged, upload.none(), editIc);
icRouter.get("/delete-ic/:id", isLogged, upload.none(), deleteIc);

module.exports = icRouter;
