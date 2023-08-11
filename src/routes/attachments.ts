import express from "express";
import { getAttachment } from "../controllers/attachments/getAttachment";
const router = express.Router();

router.get("/attachments/:id", getAttachment);

export default router;
