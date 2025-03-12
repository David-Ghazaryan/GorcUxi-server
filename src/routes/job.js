import { Router } from 'express';
import {
  create,
  update,
  remove,
  getAll,
  getOne,
  createJobApply,
  getAllJobApplies,
  removeJobApply,
} from '../controllers/job.js';
import roleMiddleware from '../middlewares/check-role.js';

const router = Router();

router.post('/', roleMiddleware(['USER', 'ADMIN']), create);
router.put('/:id', roleMiddleware(['USER', 'ADMIN']), update);
router.delete('/:id', roleMiddleware(['USER', 'ADMIN']), remove);
router.get('/', getAll);
router.get('/:id', getOne);

router.post('/:id/apply', roleMiddleware(['USER', 'ADMIN']), createJobApply);
router.get('/:id/applies', roleMiddleware(['USER', 'ADMIN']), getAllJobApplies);
router.delete('/applies/:id', roleMiddleware(['USER', 'ADMIN']), removeJobApply);
router.get('/applies', roleMiddleware(['USER', 'ADMIN']), getAllJobApplies);
export default router;
