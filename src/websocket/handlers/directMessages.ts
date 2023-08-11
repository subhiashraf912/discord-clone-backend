// ./websocket/handlers/directMessages.js

import Message from "../../models/Message";
import Channel from "../../models/Channel";
import { Socket } from "socket.io";

export default function handleDirectMessages(socket: Socket) {
  socket.on("send direct message", async (data, callback) => {
    // data might include recipient's ID and the message content
    const { recipientId, content } = data;

    // Get or create the DM channel
    let channel = await Channel.findDM(socket.user._id, recipientId);
    if (!channel) {
      // If the channel does not exist, create it
      channel = await Channel.create({
        name: `DM-${socket.user._id}-${recipientId}`,
        type: "DM",
        participants: [socket.user._id, recipientId],
      });
    }

    // Create the new message
    const message = await Message.create({
      content,
      channel: channel._id,
    });

    // Emit the new message to the channel's room
    global.ioEmitter.to(channel._id).emit("new direct message", message);

    // Send a response back to the sender
    callback({ status: "ok" });
  });
}
