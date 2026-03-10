import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ContactForm } from "./models/ContactForm.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "";

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not set. Add it to .env to enable database features.");
}

app.get("/", (_req, res) => {
  res.json({ message: "API running 🚀" });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body as { name: string; email: string; message: string };
    if (!name || !email || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const form = new ContactForm({ name, email, message });
    await form.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save form" });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (email === "salman@gmail.com" && password === "salman@123") {
    res.json({ success: true, token: "admin-authenticated" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/admin/contacts", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer admin-authenticated") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const forms = await ContactForm.find().sort({ submittedAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
