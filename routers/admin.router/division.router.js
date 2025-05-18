const express = require("express");
const {
  getAllDivisions,
  addDivision,
  editDivision,
  deleteDivision,
} = require("../../controllers/division.controller");
const divisionRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

divisionRouter.get("/division", isLogged, getAllDivisions);
divisionRouter.post("/add-division", isLogged, upload.none(), addDivision);
divisionRouter.post(
  "/edit-division/:id",
  isLogged,
  upload.none(),
  editDivision
);
divisionRouter.get("/delete-division/:id", isLogged, deleteDivision);

module.exports = divisionRouter;
