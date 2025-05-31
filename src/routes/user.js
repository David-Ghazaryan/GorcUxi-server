import Router from 'express';
import { getAll, getOne, update } from '../controllers/user.js';
import roleMiddleware from '../middlewares/check-role.js';
const router = new Router();

router.put('/info', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), update);
router.put('/:id', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), getOne);
router.get('/', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), getAll);

export default router;
