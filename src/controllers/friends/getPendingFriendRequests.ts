import { Request, Response } from "express";
import Friendship from "../../models/Friendship";
import IUser from "../../types/IUser";
const getPendingFriendRequests = async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: "pending",
    }).populate("user1 user2");

    const friendRequests = friendships.map((friendship) => {
      // Separate sent and received friend requests
      let user1 = (friendship.user1 as IUser).toObject();
      let user2 = (friendship.user2 as IUser).toObject();

      // Remove sensitive data
      delete user1.password;
      delete user1.email;
      delete user1._id;
      delete user1.__v;

      delete user2.password;
      delete user2.email;
      delete user2._id;
      delete user2.__v;

      if (userId.toString() === (friendship.user1 as IUser)._id.toString()) {
        return { sentTo: user2, status: friendship.status };
      } else {
        return {
          receivedFrom: user1,
          status: friendship.status,
        };
      }
    });

    res.status(200).json({ friendRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export default getPendingFriendRequests;
