import { config } from "dotenv";
import bodyParser from "body-parser";

config();
declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}
import express from "express";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import { getAttachment } from "./routes/attachments";
import firebaseStorageMiddleware from "./middlewares/firebaseStorageMiddleware";

connectDB();

const app = express();
// Increase the payload size limit to 10mb (adjust as needed)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Middleware to parse JSON requests
app.use(express.json());
app.use(firebaseStorageMiddleware);
app.use("/api/users", userRoutes);
app.get("/attachments/:id", getAttachment);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
