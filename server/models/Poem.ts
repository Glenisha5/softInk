import mongoose from "mongoose";

const PoemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  language: { type: String, required: true },
}, { timestamps: true });

export const Poem = mongoose.model("Poem", PoemSchema);