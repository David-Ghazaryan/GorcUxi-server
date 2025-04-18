import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/industry.js';
import roleMiddleware from '../middlewares/check-role.js';

const router = Router();

router.post('/', roleMiddleware(['EMPLOYER', 'ADMIN']), create);
router.get('/', getAll);
router.put('/:id', roleMiddleware(['EMPLOYER', 'ADMIN']), update);
router.delete('/:id', roleMiddleware(['EMPLOYER', 'ADMIN']), remove);

export default router;
