import Router from 'express';
import { getAll, getOne, update, updateAvatar } from '../controllers/user.js';
import roleMiddleware from '../middlewares/check-role.js';
const router = new Router();

router.put('/info', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), update);
router.put('/avatar', roleMiddleware(['USER', 'EMPLOYER', 'ADMIN']), updateAvatar);
router.get('/', getAll);
router.get('/:id', getOne);

export default router;
