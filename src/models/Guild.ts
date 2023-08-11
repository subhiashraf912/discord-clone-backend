import mongoose, { Schema, Document } from "mongoose";
import IGuild from "../types/IGuild";

const GuildSchema = new mongoose.Schema<IGuild>(
  {
    name: { type: String, required: true },
    // Add other fields if necessary
  },
  { timestamps: true }
);

export default mongoose.model<IGuild>("Guild", GuildSchema);
