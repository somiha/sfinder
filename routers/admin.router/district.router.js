const express = require("express");
const {
  getAllDistricts,
  addDistrict,
  editDistrict,
  deleteDistrict,
} = require("../../controllers/district.controller");
const districtRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

districtRouter.get("/district", getAllDistricts);
districtRouter.post("/add-district", upload.none(), addDistrict);
districtRouter.post("/edit-district/:id", upload.none(), editDistrict);
districtRouter.get("/delete-district/:id", deleteDistrict);

module.exports = districtRouter;
