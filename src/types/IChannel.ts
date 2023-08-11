import { Document } from "mongoose";
import IGuild from "./IGuild";
import IUser from "./IUser";

export enum ChannelType {
  DM = "DM",
  GUILD_TEXT = "GUILD_TEXT",
  GUILD_VOICE = "GUILD_VOICE",
}

export default interface IChannel extends Document {
  name: string;
  type: ChannelType;
  guild?: IGuild["_id"];
  description?: string;
  participants: IUser[];
  // Add other fields if necessary
}
