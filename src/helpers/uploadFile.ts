import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Attachment from "../models/Attachment";
type attachmentType =
  | "avatar"
  | "banner"
  | "message-attachment"
  | "server-icon"
  | "server-banner";

interface UploadFileOptions {
  fileData: string;
  path: string;
  contentType: string;
  name?: string;
  description?: string;
  spoiler?: boolean;
  type: attachmentType;
}

const uploadFile = async (options: UploadFileOptions) => {
  const { fileData, name, description, spoiler, type, path, contentType } =
    options;

  try {
    // Get a reference to the Firebase Storage service
    const storage = getStorage();

    // Convert the base64 data to a buffer
    const fileBuffer = Buffer.from(fileData, "base64");

    // Generate a unique filename with the desired file extension
    const fileExtension = "png"; // Update the file extension as needed
    const filename = `${uuidv4()}.${fileExtension}`;

    // Create a reference to the file in Firebase Storage
    const fileRef = ref(storage, `files/${type}s/${path}/${filename}`);
    // Create metadata with the specified content type
    const metadata = {
      contentType,
    };
    // Upload the file to Firebase Storage
    await uploadBytesResumable(fileRef, fileBuffer, metadata);

    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(fileRef);

    // Create an Attachment document with the necessary information
    const attachment = await Attachment.create({
      imageUrl: downloadURL,
      name,
      description,
      spoiler,
      type,
    });

    return attachment;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
export default uploadFile;
