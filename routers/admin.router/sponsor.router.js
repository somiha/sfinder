const express = require("express");
const sponsorRouter = express.Router();
const {
  getPlan,
  addPlan,
  editPlan,
  deletePlan,
  getPlanDetail,
} = require("../../controllers/sponsor.controller");
const isLogged = require("../../middlewares/isLogin");
const upload = require("../../config/multer");

sponsorRouter.get("/plan", isLogged, getPlan);
sponsorRouter.post("/add-plan", isLogged, upload.none(), addPlan);
sponsorRouter.post("/edit-plan/:id", isLogged, upload.none(), editPlan);
sponsorRouter.get("/delete-plan/:id", isLogged, deletePlan);
sponsorRouter.get("/plan-detail", isLogged, getPlanDetail);

module.exports = sponsorRouter;
