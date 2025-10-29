import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

// All routes below are protected and require admin access
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
