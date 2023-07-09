import express from "express";
import {
  loginUser,
  registerUser,
  updateAvatar,
  updateProfile,
} from "../controllers/userController";
import authenticateToken from "../middlewares/authenticateToken";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/@me", authenticateToken, (req, res) => {
  // Create a new object without the excluded properties
  const { password, email, _id, __v, ...user } = req.user.toObject();

  res.json(user);
});
router.put("/@me", authenticateToken, updateProfile);
router.put("/@me/avatar", authenticateToken, updateAvatar);
export default router;
