const express = require("express");
const {
  getFreelancer,
  changeFreelancerEnrollmentStatus,
  getFreelancerInfo,
  getFreelancerEnrollment,
  getFreelancerWithdraw,
  changeFreelancerWithdrawStatus,
  searchFreelancer,
  searchFreelancerEnrollment,
  searchFreelancerWithdraw,
  getFreelancerPending,
  changeFreelancerStatus,
  deleteFreelancer,
  deleteFreelancerEnrollment,
  getExpiredVerificationFreelancers,
  getNotes,
  addNotes,
  filter,
  searchExpiredFreelancers,
  searchFreelancerPending,
  getRejectedFreelancer,
  searchRejectedFreelancer,
  cancel_bid,
  delete_bid,
  bid_info,
} = require("../../controllers/freelancer.controller");
const freelancerRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

freelancerRouter.get("/freelancer", getFreelancer);
freelancerRouter.post(
  "/change-freelancer-enrollment-status/:id",
  upload.none(),
  changeFreelancerEnrollmentStatus
);
freelancerRouter.get("/freelancer-info/:id", getFreelancerInfo);
freelancerRouter.get("/freelancer-enrollment", getFreelancerEnrollment);
freelancerRouter.get("/freelancer-withdraw", getFreelancerWithdraw);

freelancerRouter.post(
  "/change-freelancer-withdraw-status/:id",
  upload.none(),
  changeFreelancerWithdrawStatus
);
freelancerRouter.post("/search-freelancer", upload.none(), searchFreelancer);
freelancerRouter.post(
  "/search-freelancer-withdraw",
  upload.none(),
  searchFreelancerWithdraw
);
freelancerRouter.post(
  "/search-freelancer-enrollment",
  upload.none(),
  searchFreelancerEnrollment
);
freelancerRouter.get("/freelancer-pending", getFreelancerPending);
freelancerRouter.post(
  "/change-freelancer-status/:id",
  upload.none(),
  changeFreelancerStatus
);

freelancerRouter.get("/delete-freelancer/:id", deleteFreelancer);
freelancerRouter.get(
  "/delete-freelancer-enrollment/:id",
  deleteFreelancerEnrollment
);
freelancerRouter.get(
  "/get-expired-verification-freelancers",
  getExpiredVerificationFreelancers
);

freelancerRouter.get("/withdraw-notes/:id", getNotes);
freelancerRouter.post("/add-notes/:id", upload.single("image"), addNotes);

freelancerRouter.post("/filter", filter);

freelancerRouter.post(
  "/search-freelancer-pending",
  upload.none(),
  searchFreelancerPending
);
freelancerRouter.post(
  "/search-expired-freelancers",
  upload.none(),
  searchExpiredFreelancers
);

freelancerRouter.get("/rejected-freelancers", getRejectedFreelancer);
freelancerRouter.post(
  "/search-rejected-freelancer",
  upload.none(),
  searchRejectedFreelancer
);

freelancerRouter.get("/cancel-bid", cancel_bid);
freelancerRouter.get("/bid-info", bid_info);
freelancerRouter.get("/delete-bid/:id", delete_bid);

module.exports = freelancerRouter;
