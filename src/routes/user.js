import Router from 'express';
import { update } from '../controllers/user.js';
import roleMiddleware from '../middlewares/check-role.js';
const router = new Router();

router.put('/info', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), update);

export default router;
