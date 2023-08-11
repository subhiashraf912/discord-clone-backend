import mongoose, { Schema } from "mongoose";
import IChannel, { ChannelType } from "../types/IChannel";

export interface IChannelModel extends mongoose.Model<IChannel> {
  findDM: (user1: string, user2: string) => Promise<IChannel>;
}

const ChannelSchema = new mongoose.Schema<IChannel>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(ChannelType), required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guild" },
    description: String,
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    // Add other fields if necessary
  },
  { timestamps: true }
);

ChannelSchema.statics.findDM = async function (user1: string, user2: string) {
  return this.findOne({
    type: "DM",
    recipients: { $all: [user1, user2] },
  });
};
export default mongoose.model<IChannel, IChannelModel>(
  "Channel",
  ChannelSchema
);
