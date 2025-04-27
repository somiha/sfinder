const express = require("express");
const {
  getdailyUpdate,
  addDailyUpdate,
  deleteDailyUpdate,
  editDailyUpdate,
} = require("../../controllers/daily-update.controller");
const dailyUpdateRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

dailyUpdateRouter.get("/daily-update", getdailyUpdate);
dailyUpdateRouter.post("/add-daily-update", upload.none(), addDailyUpdate);
dailyUpdateRouter.get("/delete-daily-update/:id", deleteDailyUpdate);
dailyUpdateRouter.post(
  "/edit-daily-update/:id",
  upload.none(),
  editDailyUpdate
);

module.exports = dailyUpdateRouter;
