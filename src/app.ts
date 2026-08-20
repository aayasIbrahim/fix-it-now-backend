// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";

import express, { Application, Request, Response } from "express";
import config from "./app/config";
import { PaymentController } from "./app/module/payment/payment.controller";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { CategoryRoutes } from "./app/module/category/category.route";
import { TechnicianRoutes } from "./app/module/technician/technician.route";
import { ServiceRoutes } from "./app/module/service/service.router";
import { BookingRoutes } from "./app/module/booking/booking.route";
import { PaymentRoutes } from "./app/module/payment/payment.route";
import { AdminRoutes } from "./app/module/admin/admin.route";
import { ReviewRoutes } from "./app/module/review/review.route";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.post(
  "/api/payment/webhook/stripe",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Fixitnow-backend");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/technicians", TechnicianRoutes);
app.use("/api/services", ServiceRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/review", ReviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
