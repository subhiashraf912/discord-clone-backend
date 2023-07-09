import mongoose from "mongoose";
const { Schema, model } = mongoose;

const attachmentSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    spoiler: {
      type: Boolean,
    },
    type: {
      type: String,
      enum: [
        "avatar",
        "banner",
        "messageAttachment",
        "serverIcon",
        "serverBanner",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Attachment", attachmentSchema);
