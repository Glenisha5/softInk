import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // null for Google users
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);