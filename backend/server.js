import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import patientRoutes from "./routes/patients.js";
import entryRoutes from "./routes/entries.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
await connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/patients", patientRoutes);
app.use("/api", entryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
