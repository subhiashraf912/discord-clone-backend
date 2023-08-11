import mongoose, { Schema } from "mongoose";
import IMessage from "../types/IMessage";

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    content: { type: String, maxlength: 2000 },
    nonce: { type: Schema.Types.Mixed, maxlength: 25 },
    tts: Boolean,
    embeds: [Schema.Types.Mixed],
    allowed_mentions: Schema.Types.Mixed,
    message_reference: Schema.Types.Mixed,
    sticker_ids: [{ type: String }],
    files: [Schema.Types.Mixed],
    attachments: [Schema.Types.Mixed],
    flags: Number,
    channel: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
