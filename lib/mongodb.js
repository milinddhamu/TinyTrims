import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected")
  } catch (error) {
    
    console.error(error)
  }
};

export default connectMongoDb;
