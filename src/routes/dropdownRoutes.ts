import { Router } from 'express';
import { getFloorsDropdown, getRoomTypesDropdown } from '../controllers/dropdownController';
import { authenticateUser } from '../middleware/auth';

const router: Router = Router();

router.use(authenticateUser);

router.get('/floors', getFloorsDropdown);
router.get('/room-types', getRoomTypesDropdown);

export default router;
