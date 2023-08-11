import express from "express";
import authenticateToken from "../middlewares/authenticateToken";
import { sendFriendRequest } from "../controllers/friends/sendFriendRequest";
import { handleFriendRequest } from "../controllers/friends/handleFriendRequest";
import deleteFriend from "../controllers/friends/deleteFriend";
import getAllFriends from "../controllers/friends/getAllFriends";
import getPendingFriendRequests from "../controllers/friends/getPendingFriendRequests";

const router = express.Router();

router.get("/", authenticateToken, getAllFriends);
router.get("/pending", authenticateToken, getPendingFriendRequests);
router.post("/request", authenticateToken, sendFriendRequest);
router.post("/handle", authenticateToken, handleFriendRequest);
router.delete("/:userId", authenticateToken, deleteFriend);
export default router;
