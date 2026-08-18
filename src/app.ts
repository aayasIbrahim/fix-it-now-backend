import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { ServiceRoutes } from "./app/module/service/service.router";
import { CategoryRoutes } from "./app/module/category/category.route";
import { TechnicianRoutes } from "./app/module/technician/technician.route";
import { BookingRoutes } from "./app/module/booking/booking.route";
import { AdminRoutes } from "./app/module/admin/admin.route";

const app: Application = express();

app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to FixitNow Backend",
    author: "Ayas Ibrahim",
  });
});
app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/technicians", TechnicianRoutes);
app.use("/api/services", ServiceRoutes);
app.use("/api/bookings", BookingRoutes);
app.use('/api/admin', AdminRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
