import { Router } from 'express';
import { getFloorsByBranch, createFloor } from '../controllers/floorController';
import { authenticateToken, injectUserBranch } from '../middleware/auth';

const router: Router = Router();

router.use(authenticateToken);
router.use(injectUserBranch);

router.get('/all', getFloorsByBranch);
router.post('/', createFloor);

export default router;
