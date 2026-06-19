import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import poemRoutes from "./routes/poems.ts";
import authRoutes from "./routes/auth.ts";
import feedbackRoutes from "./routes/feedback.ts"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/feedback",feedbackRoutes)
app.use("/api/poems", poemRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MongoDB connection string. Set MONGODB_URI in the server environment.");
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected!");
    console.log("DB name:", mongoose.connection.name);
    console.log("DB host:", mongoose.connection.host);
    
    // Test query directly
    mongoose.connection.db?.collection('poems').find({}).limit(3).toArray().then(docs => {
      console.log("Direct DB query - poems found:", docs.length);
      console.log("Sample doc:", JSON.stringify(docs[0]));
    });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Connection error:", err));

  app.use(cors());
app.use(express.json());

// ADD THIS TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ message: "Server works!" });
});

app.use("/api/poems", poemRoutes);
app.use("/api/auth",authRoutes);