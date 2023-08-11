import { Request, Response } from "express";
import Attachment from "../../models/Attachment";
import { getDownloadURL, getMetadata, getStorage, ref } from "firebase/storage";
import https from "https";

export const getAttachment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const attachment = await Attachment.findById(id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(getStorage(), attachment.imageUrl);

    // Get the download URL for the file
    const downloadURL = await getDownloadURL(storageRef);

    // Fetch the image metadata from the download URL
    const metadataResponse = await getMetadata(storageRef);
    const contentType = metadataResponse.contentType;

    // Set the response headers to display the image in the browser
    res.setHeader("Content-Type", contentType!);

    // Stream the file from Firebase Storage to the response
    https.get(downloadURL, (response) => {
      response.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
