import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("overwriteModels", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", (connection) => {
      console.log("Mongoose has successfully connected!");
    });

    mongoose.connection.on("err", (err: any) => {
      console.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose connection lost");
    });
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      autoIndex: false,
      maxPoolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
      dbName: "discord",
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
