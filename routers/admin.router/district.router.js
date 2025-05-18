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

districtRouter.get("/district", isLogged, getAllDistricts);
districtRouter.post("/add-district", isLogged, upload.none(), addDistrict);
districtRouter.post(
  "/edit-district/:id",
  isLogged,
  upload.none(),
  editDistrict
);
districtRouter.get("/delete-district/:id", isLogged, deleteDistrict);

module.exports = districtRouter;
