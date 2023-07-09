import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  global_name: { type: String, default: null },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: "Attachment",
  },
  banner: {
    type: Schema.Types.ObjectId,
    ref: "Attachment",
  },
  bot: { type: Boolean, default: false },
  system: { type: Boolean, default: false },
  mfa_enabled: { type: Boolean, default: false },
  accent_color: { type: Number, default: null },
  locale: { type: String, default: null },
  verified: { type: Boolean, default: false },
  flags: { type: Number, default: 0 },
  premium_type: { type: Number, default: 0 },
  public_flags: { type: Number, default: 0 },
  tokenVersion: { type: Number, required: true, default: 1 },
});

const User = mongoose.model("User", UserSchema);

export default User;
