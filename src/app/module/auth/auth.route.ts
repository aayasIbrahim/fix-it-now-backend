import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  AuthController.getMe,
);
router.post("/refresh-token", AuthController.refreshToken);

router.patch(
  "/me",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),

  AuthController.updateMyProfile,
);
router.post(
  '/address',
  auth(Role.TECHNICIAN),
  AuthController.addAddress
);
export const AuthRoutes = router;
