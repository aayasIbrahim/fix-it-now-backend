import express from "express";

import { ReviewController } from "./review.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  auth(Role.CUSTOMER),

  ReviewController.createReview,
);

router.get("/", ReviewController.getAllReviews);

router.get("/my-reviews", auth(Role.CUSTOMER), ReviewController.getMyReviews);

router.get("/technician/:technicianId", ReviewController.getTechnicianReviews);

router.get("/booking/:bookingId", ReviewController.getReviewByBookingId);

export const ReviewRoutes = router;
