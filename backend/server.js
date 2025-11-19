import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { pool } from "./db.js";
import canvasRoutes from "./routes/canvasRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Allowed origins for production and development
const allowedOrigins = [
  "http://localhost:3000",                          // local dev
  "https://plannerpal-ex34i.ondigitalocean.app",    // backend URL
  "https://<FRONTEND_URL>.ondigitalocean.app",      // replace once frontend deployed
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Main routes
app.use("/", routes);
app.use("/canvas", canvasRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
