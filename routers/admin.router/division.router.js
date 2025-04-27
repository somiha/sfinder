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

divisionRouter.get("/division", getAllDivisions);
divisionRouter.post("/add-division", upload.none(), addDivision);
divisionRouter.post("/edit-division/:id", upload.none(), editDivision);
divisionRouter.get("/delete-division/:id", deleteDivision);

module.exports = divisionRouter;
