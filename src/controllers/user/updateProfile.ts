import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import validateEmail from "../../helpers/validateEmail";

const updateProfile = async (req: Request, res: Response) => {
  const updates = req.body;
  const userId = req.user.id;

  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    updates.password = hashedPassword;
    updates.tokenVersion = req.user.tokenVersion + 1;
  }

  if (updates.username) {
    const usernameExists = await User.findOne({ username: updates.username });
    if (usernameExists && String(usernameExists._id) !== String(userId)) {
      return res.status(400).json({
        message: "Username is already taken. Please try a different username.",
      });
    }
  }

  if (updates.email) {
    if (!validateEmail(updates.email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const emailExists = await User.findOne({ email: updates.email });
    if (emailExists && String(emailExists._id) !== String(userId)) {
      return res.status(400).json({
        message: "Email is already taken. Please try a different email.",
      });
    }
  }

  try {
    const updatedUser = await User.findOneAndUpdate({ id: userId }, updates, {
      new: true,
    }).select("-password -tokenVersion -_id -__v");

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
export default updateProfile;
