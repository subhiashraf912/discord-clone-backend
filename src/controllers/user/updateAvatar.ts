import { Request, Response } from "express";
import Attachment from "../../models/Attachment";
import { deleteFile } from "../../helpers/deleteFile";
import User from "../../models/User";
import uploadFile from "../../helpers/uploadFile";

const updateAvatar = async (req: Request, res: Response) => {
  const { imageBase64 } = req.body;
  const userId = req.user._id;

  try {
    const oldAvatarAttachmentId = req.user?.avatar;

    // Delete the old avatar file if it exists
    if (oldAvatarAttachmentId) {
      const oldAttachment = await Attachment.findOneAndDelete(
        oldAvatarAttachmentId
      );
      if (oldAttachment) {
        // Delete the old avatar file from Firebase Storage
        await deleteFile(oldAttachment.imageUrl);
      }
    }

    // Extract the base64-encoded image data from the Data URL
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Upload the image and create the Attachment document
    const attachment = await uploadFile({
      fileData: base64Data,
      name: "Avatar",
      type: "avatar",
      path: req.user.id,
      contentType: "image/png",
    });

    // Update the user's avatar field with the ID of the new Attachment
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: attachment.id },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
export default updateAvatar;
