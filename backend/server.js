import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { pool } from "./db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
app.use("/", routes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
