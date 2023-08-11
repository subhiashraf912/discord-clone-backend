import { Request, Response } from "express";
import Friendship from "../../models/Friendship";
import User from "../../models/User";

export const sendFriendRequest = async (req: Request, res: Response) => {
  const senderId = req.user._id;
  const { userId } = req.body;

  try {
    // Check if the recipient user exists
    const recipient = await User.findOne({ id: userId });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient user not found" });
    }

    const recipientId = recipient._id;

    // Check if the sender and recipient are already friends
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: senderId, user2: recipientId },
        { user1: recipientId, user2: senderId },
      ],
    });
    if (existingFriendship) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Create a new Friendship document with the sender and recipient IDs
    const friendship = await Friendship.create({
      user1: senderId,
      user2: recipientId,
      status: "pending",
    });

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
