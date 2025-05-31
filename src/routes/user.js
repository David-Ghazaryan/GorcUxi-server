import Router from 'express';
import { getAll, getOne, update } from '../controllers/user.js';
import roleMiddleware from '../middlewares/check-role.js';
const router = new Router();

router.put('/info', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), update);
router.get('/:id',  getOne);
router.get('/',  getAll);

export default router;
