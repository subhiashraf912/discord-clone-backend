import { Document } from "mongoose";
import IChannel from "./IChannel";

interface IMessage extends Document {
  content?: string;
  nonce?: string | number;
  tts?: boolean;
  embeds?: any[];
  allowed_mentions?: any;
  message_reference?: any;
  sticker_ids?: string[];
  files?: any[];
  attachments?: any[];
  flags?: number;
  channel: IChannel["_id"];
}

export default IMessage;
