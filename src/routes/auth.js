import Router from "express";
import {
  signUp,
  signIn,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/auth.js";
import roleMiddleware from "../middlewares/check-role.js";
const router = new Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/me", getMe);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post(
  "/update-password",
  roleMiddleware(["USER", "ADMIN"]),
  updatePassword
);

export default router;
