import { Router } from 'express';
import {
  create,
  update,
  remove,
  getAll,
  getOne,
 getUser,
} from '../controllers/company.js';
import roleMiddleware from '../middlewares/check-role.js';

const router = Router();

router.post('/', roleMiddleware(['USER', 'ADMIN']), create);
router.put('/:id', roleMiddleware(['USER', 'ADMIN']), update);
router.delete('/:id', roleMiddleware(['USER', 'ADMIN']), remove);
router.get('/', getAll);
router.get('/user', getUser);
router.get('/:id', getOne);

export default router;
