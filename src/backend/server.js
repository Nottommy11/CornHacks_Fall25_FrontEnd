// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// simple endpoint to test connection
app.get("/", (req, res) => {
  res.send("✅ Gemini server is running!");
});

// chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.message || "Hello";
    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
});

app.listen(3000, () => console.log("✅ Gemini server running on port 3000"));
