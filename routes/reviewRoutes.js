// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const {
  createReview,
  getUserReviews,
  updateReview
} = require("../controllers/reviewController");

router.post("/", createReview);
router.get("/:userId", getUserReviews);
router.patch("/:reviewId", updateReview);

module.exports = router;
