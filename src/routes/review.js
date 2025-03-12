import { Router } from "express";
import {
  create,
  getOne,
  getAll,
  update,
  remove,
} from "../controllers/pricing.js";
import roleMiddleware from "../middlewares/check-role.js";

const router = Router();

router.post("/", roleMiddleware(["USER", "ADMIN"]), create);
router.get("/:id", getOne);
router.get("/", getAll);
router.put("/:id", roleMiddleware(["USER", "ADMIN"]), update);
router.delete("/:id", roleMiddleware(["USER", "ADMIN"]), remove);

export default router;
