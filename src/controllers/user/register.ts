import { Request, Response } from "express";
import validateEmail from "../../helpers/validateEmail";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import generateID from "../../helpers/generateID";
const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format.");
    }

    // Explicitly check if the username is taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        message: "Username is already taken. Please try a different username.",
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "Email is already taken. Please try a different email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = generateID("1");

    const user = await User.create({
      id,
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      throw new Error("Invalid user data");
    }
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).json({
        message: "Email is already taken. Please try a different email.",
      });
    } else if (error.message === "Invalid email format.") {
      res.status(400).json({
        message: error.message,
      });
    } else {
      // handle other types of errors...
      return;
    }
  }
};

export default registerUser;
