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

router.post("/", roleMiddleware(["USER", "EMPLOYER", "ADMIN"]), create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", roleMiddleware(["USER", "EMPLOYER", "ADMIN"]), update);
router.delete("/:id", roleMiddleware(["USER", "EMPLOYER", "ADMIN"]), remove);

export default router;
