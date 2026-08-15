import express from "express";

import { ServiceController } from "./service.controller";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";

const router = express.Router();

router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getServiceById);

router.post(
  "/",
  auth(Role.TECHNICIAN, Role.ADMIN),
  ServiceController.createService,
);

router.patch(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),

  ServiceController.updateService,
);

router.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  ServiceController.deleteService,
);

export const ServiceRoutes = router;
