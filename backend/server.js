import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
