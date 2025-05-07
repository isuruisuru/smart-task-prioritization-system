import express from "express";
import {
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";

const router = express.Router();

// Public routes (no authentication needed)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/login-status", userLoginStatus);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);
router.post("/verify-user/:verificationToken", verifyUser);

// Protected routes (authentication needed)
router.get("/logout", protect, logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);
router.post("/verify-email", protect, verifyEmail);
router.patch("/change-password", protect, changePassword);

// Admin routes (authentication needed, no role restriction)
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);
router.get("/admin/users", protect, getAllUsers);

export default router;
