import { config } from "dotenv";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import connectDB from "./config/database";
import routes from "./routes";
import firebaseStorageMiddleware from "./middlewares/firebaseStorageMiddleware";
import socketHandlers from "./websocket/socketHandlers";

import { createAdapter } from "socket.io-redis";
import { createClient } from "redis";
import { createEmitter } from "socket.io-emitter";
import express from "express";
config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Setting up Redis and Socket.IO-Redis
const pubClient = createClient({ host: "localhost", port: 6379 }); // replace with your Redis config
const subClient = pubClient.duplicate();
io.adapter(createAdapter({ pubClient, subClient }));

// Setting up Socket.IO-Emitter
global.ioEmitter = createEmitter(pubClient); // now you can use this in any part of your app to emit events

socketHandlers(io);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (msg) => {
    console.log("message: " + msg);
  });
});

// Increase the payload size limit to 10mb (adjust as needed)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Middleware to parse JSON requests
app.use(express.json());
app.use(firebaseStorageMiddleware);
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
