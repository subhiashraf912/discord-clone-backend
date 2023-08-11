import mongoose, { Document, Schema } from "mongoose";
import IUser from "../types/IUser";

interface IFriendship extends Document {
  user1: Schema.Types.ObjectId | IUser;
  user2: Schema.Types.ObjectId | IUser;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const friendshipSchema: Schema = new Schema<IFriendship>(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Friendship = mongoose.model<IFriendship>("Friendship", friendshipSchema);

export default Friendship;
