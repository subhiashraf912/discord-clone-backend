import { Request, Response } from "express";
import Friendship from "../../models/Friendship";
import User from "../../models/User";

interface RequestBody {
  userId: string;
  action: "accept" | "decline";
}

export const handleFriendRequest = async (
  req: Request<any, any, RequestBody>,
  res: Response
) => {
  const senderId = req.user._id;
  const { userId, action } = req.body;

  try {
    // Check if the friendship request exists
    const recipient = await User.findOne({ id: userId });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient user not found" });
    }
    const recipientId = recipient._id;

    const friendship = await Friendship.findOne({
      $or: [
        { user1: senderId, user2: recipientId },
        { user1: recipientId, user2: senderId },
      ],
    });
    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Only recipient should be able to handle the request
    if (
      friendship.user1.toString() !== recipientId.toString() &&
      friendship.user2.toString() !== recipientId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update the status based on the action
    if (action === "accept") {
      friendship.status = "accepted";
    } else if (action === "decline") {
      friendship.status = "declined";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await friendship.save();
    res.status(200).json({ message: "Friend request handled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
