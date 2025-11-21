import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { pool } from "./db.js";
import canvasRoutes from "./routes/canvasRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Main routes
app.use("/", routes);
app.use("/canvas", canvasRoutes);  // <--- register before listen

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
