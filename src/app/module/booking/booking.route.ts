import express from "express";

import { BookingController } from "./booking.controller";

import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = express.Router();

// {{baseUrl}}/api/bookings/
router.post("/", auth(Role.CUSTOMER), BookingController.createBooking);

// {{baseUrl}}/api/bookings/
router.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  BookingController.getUserBookings,
);

// {{baseUrl}}/api/bookings/:id
router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  BookingController.getBookingById,
);

// {{baseUrl}}/api/bookings/:id/status
router.patch(
  "/:id/status",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),

  BookingController.updateBookingStatus,
);

export const BookingRoutes = router;
