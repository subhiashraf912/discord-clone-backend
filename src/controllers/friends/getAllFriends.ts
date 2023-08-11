import { Request, Response } from "express";
import Friendship from "../../models/Friendship";
import IUser from "../../types/IUser";
const getAllFriends = async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    // Use $or operator to find friendships where the user is either user1 or user2
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: "accepted",
    }).populate("user1 user2");

    // Format the result to only include friend user documents
    const friends = friendships.map((friendship) => {
      let user1 = (friendship.user1 as IUser).toObject();
      let user2 = (friendship.user2 as IUser).toObject();

      // Remove sensitive data
      delete user1.password;
      delete user1.email;
      delete user1._id;
      delete user1.__v;
      delete user1.tokenVersion;

      delete user2.password;
      delete user2.email;
      delete user2._id;
      delete user2.__v;
      delete user2.tokenVersion;

      return userId.toString() === user1.toString() ? user2 : user1;
    });

    res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export default getAllFriends;
