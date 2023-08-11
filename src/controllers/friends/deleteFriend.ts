import { Request, Response } from "express";
import Friendship from "../../models/Friendship";
import User from "../../models/User";

export const deleteFriend = async (req: Request, res: Response) => {
  const senderId = req.user._id;
  const { userId } = req.params;
  try {
    // Check if the users are friends
    const otherUser = await User.findOne({ id: userId });
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendship = await Friendship.findOne({
      $or: [
        { user1: senderId, user2: otherUser._id },
        { user1: otherUser._id, user2: senderId },
      ],
      status: "accepted",
    });
    if (!friendship) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Delete the Friendship document
    await Friendship.deleteOne({ _id: friendship._id });
    res.status(200).json({ message: "Friend deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export default deleteFriend;
