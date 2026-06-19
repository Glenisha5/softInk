import express from "express";
import { Poem } from "../models/Poem.ts";
import mongoose from "mongoose";

const router = express.Router();

// GET poems by language and genre
router.get("/:language", async (req, res) => {
  try {
    const { language } = req.params;
    console.log("Language received:", language);
    console.log("DB name:", mongoose.connection.name);
    
    const allPoems = await Poem.find({});
    console.log("All poems in collection:", allPoems.length);
    console.log("Sample:", JSON.stringify(allPoems[0]));

    const poems = await Poem.find({
      language: new RegExp(`^${language}$`, "i"),
    });
    console.log("Filtered poems:", poems.length);
      
    if (!poems.length) {
      return res.status(404).json({ error: "No poems found" });
    }
    res.json(poems);
  } catch (error) {
    console.error("Route error:",error)
    res.status(500).json({ error: "Server error" });
  }
});

// POST add a new poem (admin)
router.post("/", async (req, res) => {
  try {
    const { password, ...poemData } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const poem = new Poem({
      ...poemData,
      language: typeof poemData.language === "string" ? poemData.language.toLowerCase() : poemData.language,
    });
    await poem.save();
    res.status(201).json(poem);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a poem (admin)
router.delete("/:id", async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await Poem.findByIdAndDelete(req.params.id);
    res.json({ message: "Poem deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;