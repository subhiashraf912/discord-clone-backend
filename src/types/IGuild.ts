import { Document } from "mongoose";

export default interface IGuild extends Document {
  name: string;
  // Add other fields if necessary
}
