import { Document, Schema } from "mongoose";
import IAttachment from "./IAttachment";

interface IUser extends Document {
  email: string;
  password: string;
  id: string;
  username: string;
  global_name: string | null;
  avatar: Schema.Types.ObjectId | IAttachment;
  banner: Schema.Types.ObjectId | IAttachment;
  bot: boolean;
  system: boolean;
  mfa_enabled: boolean;
  accent_color: number | null;
  locale: string | null;
  verified: boolean;
  flags: number;
  premium_type: number;
  public_flags: number;
  tokenVersion: number;
}

export default IUser;
