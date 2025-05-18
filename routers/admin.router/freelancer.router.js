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
  filtering,
  searchCancelBid,
  searchBid,
} = require("../../controllers/freelancer.controller");
const freelancerRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

freelancerRouter.get("/freelancer", isLogged, getFreelancer);
freelancerRouter.post(
  "/change-freelancer-enrollment-status/:id",
  isLogged,
  upload.none(),
  changeFreelancerEnrollmentStatus
);
freelancerRouter.get("/freelancer-info/:id", isLogged, getFreelancerInfo);
freelancerRouter.get(
  "/freelancer-enrollment",
  isLogged,
  getFreelancerEnrollment
);
freelancerRouter.post(
  "/freelancer-enrollment",
  isLogged,
  upload.none(),
  filtering
);
freelancerRouter.post("/search-bid", isLogged, upload.none(), searchBid);
freelancerRouter.post(
  "/search-cancel-bid",
  isLogged,
  upload.none(),
  searchCancelBid
);
freelancerRouter.get("/freelancer-withdraw", isLogged, getFreelancerWithdraw);

freelancerRouter.post(
  "/change-freelancer-withdraw-status/:id",
  isLogged,
  upload.none(),
  changeFreelancerWithdrawStatus
);
freelancerRouter.post(
  "/search-freelancer",
  isLogged,
  upload.none(),
  searchFreelancer
);
freelancerRouter.post(
  "/search-freelancer-withdraw",
  isLogged,
  upload.none(),
  searchFreelancerWithdraw
);
freelancerRouter.post(
  "/search-freelancer-enrollment",
  isLogged,
  upload.none(),
  searchFreelancerEnrollment
);
freelancerRouter.get("/freelancer-pending", isLogged, getFreelancerPending);
freelancerRouter.post(
  "/change-freelancer-status/:id",
  isLogged,
  upload.none(),
  changeFreelancerStatus
);

freelancerRouter.get("/delete-freelancer/:id", isLogged, deleteFreelancer);
freelancerRouter.get(
  "/delete-freelancer-enrollment/:id",
  isLogged,
  deleteFreelancerEnrollment
);
freelancerRouter.get(
  "/get-expired-verification-freelancers",
  isLogged,
  getExpiredVerificationFreelancers
);

freelancerRouter.get("/withdraw-notes/:id", isLogged, getNotes);
freelancerRouter.post(
  "/add-notes/:id",
  isLogged,
  upload.single("image"),
  addNotes
);

freelancerRouter.post("/filter", isLogged, filter);

freelancerRouter.post(
  "/search-freelancer-pending",
  isLogged,
  upload.none(),
  searchFreelancerPending
);
freelancerRouter.post(
  "/search-expired-freelancers",
  isLogged,
  upload.none(),
  searchExpiredFreelancers
);

freelancerRouter.get("/rejected-freelancers", isLogged, getRejectedFreelancer);
freelancerRouter.post(
  "/search-rejected-freelancer",
  isLogged,
  upload.none(),
  searchRejectedFreelancer
);

freelancerRouter.get("/cancel-bid", isLogged, cancel_bid);
freelancerRouter.get("/bid-info", isLogged, bid_info);
freelancerRouter.get("/delete-bid/:id", isLogged, delete_bid);

module.exports = freelancerRouter;
