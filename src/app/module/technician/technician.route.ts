// src/modules/technician/technician.route.ts

import express from 'express';

import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../../prisma/generated/prisma/enums';


const router = express.Router();

// =========================================================
// 1. SPECIFIC / STATIC ROUTES (MUST BE DEFINED FIRST)
// =========================================================

// GET /api/technicians/bookings
router.get(
  '/bookings',
  auth(Role.TECHNICIAN),
  TechnicianController.getTechnicianBookings
);

// GET /api/technicians/availability  <-- ADDED HERE
router.get(
  '/availability',
  auth(Role.TECHNICIAN),
  TechnicianController.getAvailability
);

// PATCH /api/technicians/bookings/:id
router.patch(
  '/bookings/:id',
  auth(Role.TECHNICIAN),

  TechnicianController.updateBookingStatus
);

// PATCH /api/technicians/profile
router.patch(
  '/profile',
  auth(Role.TECHNICIAN),

  TechnicianController.updateProfile
);

// PATCH /api/technicians/availability
router.patch(
  '/availability',
  auth(Role.TECHNICIAN),

  TechnicianController.setAvailability
);

// =========================================================
// 2. PUBLIC & DYNAMIC ROUTES (MUST BE DEFINED LAST)
// =========================================================

// GET /api/technicians
router.get('/', TechnicianController.getAllTechnicians);

// GET /api/technicians/:id  <-- MUST BE AT THE VERY BOTTOM!
router.get('/:id', TechnicianController.getTechnicianById);

export const TechnicianRoutes = router;