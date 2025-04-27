const express = require("express");
const userRouter = express.Router();
const {
  getUser,
  getUserDetails,
  changeUserVerification,
  getUserReport,
  deleteUserReport,
  getUserReportDetails,
  getUserReset,
  changeUserResetOption,
  deleteUserReset,
  searchUser,
  deleteUser,
  getOneYearOveredVerifiedUser,
  deleteOneYearOveredVerifiedUser,
  unverifyUser,
} = require("../../controllers/user.controller");
const {
  getSubscriptionOveredUsers,
  deleteSubscriptionOveredUser,
  deleteAllSubscriptionOveredUsers,
} = require("../../controllers/user-subscription-overed-users.controller");
const isLogged = require("../../middlewares/isLogin");
const upload = require("../../config/multer");

userRouter.get("/user", isLogged, getUser);
userRouter.get("/user-details/:id", isLogged, getUserDetails);
userRouter.post(
  "/change-user-verification/:id",
  upload.none(),
  changeUserVerification
);
userRouter.get("/user-report", getUserReport);
userRouter.get("/delete-user-report/:id", deleteUserReport);
userRouter.get("/user-report-details/:id", getUserReportDetails);
userRouter.get("/user-reset", getUserReset);
userRouter.post(
  "/change-user-reset-option/:id",
  upload.none(),
  changeUserResetOption
);
userRouter.get("/delete-user-reset/:id", deleteUserReset);
userRouter.post("/search-user", upload.none(), searchUser);
userRouter.get("/delete-user/:id", deleteUser);

userRouter.get("/subscription-overed-users", getSubscriptionOveredUsers);
userRouter.get(
  "/delete-subscription-overed-user",
  deleteSubscriptionOveredUser
);
userRouter.get(
  "/delete-all-subscription-overed-users",
  deleteAllSubscriptionOveredUsers
);

userRouter.get("/one-year-overed-verified-user", getOneYearOveredVerifiedUser);
userRouter.get(
  "/delete-one-year-overed-verified-user",
  deleteOneYearOveredVerifiedUser
);

userRouter.get("/unverify-user", unverifyUser);

module.exports = userRouter;
