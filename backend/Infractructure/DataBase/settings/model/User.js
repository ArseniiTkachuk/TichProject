import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ім'я обов'язкове"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email обов'язковий"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Будь ласка, введіть коректний email"],
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    imageUrl: {
      type: String,
      default: "/utils/defaultUserImg.png",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailCodeHash: String,
    emailCodeExpires: Date,

    deleteAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
