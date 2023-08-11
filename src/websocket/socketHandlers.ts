import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";
import handleDirectMessages from "./handlers/directMessages";
import { createAdapter, RedisAdapter } from "socket.io-redis";

const ioEmitter = new RedisAdapter.EventEmitter({});
global.ioEmitter = ioEmitter;

// import handleGuildMessages from "./handlers/guildMessages";
// import other handlers as necessary
export default function socketHandlers(io: Server) {
  io.adapter(createAdapter());
  io.use(async (socket, next) => {
    // the handshake query is available in socket.handshake.query
    const token = socket.handshake.query.token as string;

    if (!token) {
      return next(new Error("Authentication error: no token"));
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findOne({ id: decoded.id });
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return next(new Error("Authentication error: invalid token"));
      }

      // attach the user to the socket object
      socket.user = user;

      next();
    } catch (error) {
      return next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    handleDirectMessages(socket);
    // handleGuildMessages(socket);
    // call other handlers as necessary
  });
}
