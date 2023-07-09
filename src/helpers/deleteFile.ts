import { getStorage, ref, deleteObject } from "firebase/storage";

export const deleteFile = async (fileUrl: string) => {
  try {
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(getStorage(), fileUrl);

    // Delete the file from Firebase Storage
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
