import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import placeRouter from "./routes/place-routes.js";
import userRouter from "./routes/user-routes.js";
import HttpError from "./util/http-error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/places", placeRouter);
app.use("/api/users", userRouter);

app.use((req, res, next) => {
  next(new HttpError("Route not found", 404));
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Error Occurred" });
});

console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log(`Server successfully connected to MongoDB and started on port ${port}`);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });