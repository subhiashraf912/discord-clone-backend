import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SnowflakeId = require("snowflake-id").default;
import uploadFile from "../helpers/uploadFile";
import Attachment from "../models/Attachment";
import { deleteFile } from "../helpers/deleteFile";
// Initialize your cloud storage client
// Initialize your cloud storage client

const gen = new SnowflakeId();

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
export const registerUser = async (req: Request, res: Response) => {
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
    const id = `1${gen.generate()}`;

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
export const loginUser = async (req: Request, res: Response) => {
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

export const updateProfile = async (req: Request, res: Response) => {
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
export const updateAvatar = async (req: Request, res: Response) => {
  const { imageBase64 } = req.body;
  const userId = req.user._id;

  try {
    const oldAvatarAttachmentId = req.user?.avatar;

    // Delete the old avatar file if it exists
    if (oldAvatarAttachmentId) {
      const oldAttachment = await Attachment.findOneAndDelete(
        oldAvatarAttachmentId
      );
      if (oldAttachment) {
        // Delete the old avatar file from Firebase Storage
        await deleteFile(oldAttachment.imageUrl);
      }
    }

    // Extract the base64-encoded image data from the Data URL
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Upload the image and create the Attachment document
    const attachment = await uploadFile({
      fileData: base64Data,
      name: "Avatar",
      type: "avatar",
      path: req.user.id,
      contentType: "image/png",
    });

    // Update the user's avatar field with the ID of the new Attachment
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: attachment.id },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
