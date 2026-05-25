import { Router } from 'express';
import { getFloorsByBranch, createFloor } from '../controllers/floorController';
import { authenticateUser } from '../middleware/auth';

const router: Router = Router();

router.use(authenticateUser);

router.get('/all', getFloorsByBranch);

router.post('/', createFloor);

export default router;
