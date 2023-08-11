import express from "express";
import userRoutes from "./userRoutes";
import attachmentRoutes from "./attachments";
import friendshipsRoutes from "./friends";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/attachments", attachmentRoutes);
router.use("/friends", friendshipsRoutes);
export default router;
