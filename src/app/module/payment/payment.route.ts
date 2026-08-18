import express from "express";


import { PaymentController } from "./payment.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../../prisma/generated/prisma/enums";
const router = express.Router();

// Webhook Route (Public & Raw Body Parser)
// router.post(
//   "/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   PaymentController.stripeWebhook
// );

// Payment Operations
router.post(
  "/create",
  auth(Role.CUSTOMER),

  PaymentController.createPaymentIntent
);


router.post(
  "/confirm",
  auth(Role.CUSTOMER),

  PaymentController.confirmPayment
);

router.post(
  "/refund",
  auth(Role.ADMIN),
,
  PaymentController.refundPayment
);

// Query Operations
router.get(
  "/history",
  auth(Role.CUSTOMER),
  PaymentController.getPaymentHistory
);

router.get(
  "/",
  auth(Role.ADMIN),
  PaymentController.getAllPayments
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  PaymentController.getPaymentById
);

export const PaymentRoutes = router;