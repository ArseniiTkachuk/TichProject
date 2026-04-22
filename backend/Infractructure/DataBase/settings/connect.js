import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // const conn = await mongoose.connect("localhost:27017/TichPrj_dev");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Зупиняємо процес, якщо БД не підключилася
  }
};
