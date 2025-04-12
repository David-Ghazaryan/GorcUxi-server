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

router.post('/', roleMiddleware(['EMPLOYER', 'ADMIN']), create);
router.put('/:id', roleMiddleware(['EMPLOYER', 'ADMIN']), update);
router.delete('/:id', roleMiddleware(['EMPLOYER', 'ADMIN']), remove);
router.get('/', getAll);
router.get('/:id', getOne);

router.post('/:id/apply', roleMiddleware(['EMPLOYER', 'ADMIN']), createJobApply);
router.get('/:id/applies', roleMiddleware(['EMPLOYER', 'ADMIN']), getAllJobApplies);
router.delete('/applies/:id', roleMiddleware(['EMPLOYER', 'ADMIN']), removeJobApply);
router.get('/applies', roleMiddleware(['EMPLOYER', 'ADMIN']), getAllJobApplies);
export default router;
