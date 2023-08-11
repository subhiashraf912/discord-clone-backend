import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (req: Request, res: Response) => {
  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({ message: "JWT_SECRET environment variable not set." });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, tokenVersion: user.tokenVersion },
        process.env.JWT_SECRET,
        {
          expiresIn: "30 days",
        }
      );

      res.json({
        _id: user._id,
        username: user.username,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export default loginUser;
