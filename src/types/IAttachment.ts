import { Document } from "mongoose";

interface IAttachment extends Document {
  imageUrl: string;
  name?: string;
  description?: string;
  spoiler?: boolean;
  type:
    | "avatar"
    | "banner"
    | "message-attachment"
    | "server-icon"
    | "server-banner";
  createdAt: Date;
  updatedAt: Date;
}

export default IAttachment;
