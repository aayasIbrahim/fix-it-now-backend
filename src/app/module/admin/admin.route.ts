import express from 'express';


import { AdminController } from './admin.controller';

import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../../prisma/generated/prisma/enums';

const router = express.Router();

router.get('/users', auth(Role.ADMIN), AdminController.getAllUsers);

router.patch(
  '/users/:id',
  auth(Role.ADMIN),
  
  AdminController.updateUserStatus
);

router.get('/bookings', auth(Role.ADMIN), AdminController.getAllBookingsAdmin);

router.get('/users/:id', auth(Role.ADMIN), AdminController.getUserById);

router.get('/categories', auth(Role.ADMIN), AdminController.getAllCategories);

router.post(
  '/categories',
  auth(Role.ADMIN),
 
  AdminController.createCategory
);

router.get('/reviews', auth(Role.ADMIN), AdminController.getAllReviews);

router.delete('/reviews/:id', auth(Role.ADMIN), AdminController.deleteReview);

export const AdminRoutes = router;