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
  filtering,
  deleteSelectedUsers,
  searchUserReport,
  searchUserReset,
  resetUsers,
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
  isLogged,
  upload.none(),
  changeUserVerification
);
userRouter.post("/bulk-reset-users", isLogged, upload.none(), resetUsers);
userRouter.post("/delete-selected-users", isLogged, deleteSelectedUsers);
userRouter.get("/user-report", isLogged, getUserReport);
userRouter.get("/delete-user-report/:id", isLogged, deleteUserReport);
userRouter.get("/user-report-details/:id", isLogged, getUserReportDetails);
userRouter.get("/user-reset", isLogged, getUserReset);
userRouter.post("/user-reset", isLogged, upload.none(), filtering);
userRouter.post(
  "/change-user-reset-option/:id",

  upload.none(),
  changeUserResetOption
);
userRouter.get("/delete-user-reset/:id", isLogged, deleteUserReset);
userRouter.post("/search-user", isLogged, upload.none(), searchUser);
userRouter.post(
  "/search-user-report",
  isLogged,
  upload.none(),
  searchUserReport
);
userRouter.post("/search-user-reset", isLogged, upload.none(), searchUserReset);
userRouter.get("/delete-user/:id", isLogged, deleteUser);

userRouter.get(
  "/subscription-overed-users",
  isLogged,
  getSubscriptionOveredUsers
);
userRouter.get(
  "/delete-subscription-overed-user",
  isLogged,
  deleteSubscriptionOveredUser
);
userRouter.get(
  "/delete-all-subscription-overed-users",
  isLogged,
  deleteAllSubscriptionOveredUsers
);

userRouter.get(
  "/one-year-overed-verified-user",
  isLogged,
  getOneYearOveredVerifiedUser
);
userRouter.get(
  "/delete-one-year-overed-verified-user",
  isLogged,
  deleteOneYearOveredVerifiedUser
);

userRouter.get("/unverify-user", isLogged, unverifyUser);

module.exports = userRouter;
