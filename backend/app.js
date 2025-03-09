import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import multer from "multer";

import placeRouter from "./routes/place-routes.js";
import userRouter from "./routes/user-routes.js";

const app = express();

app.use(bodyParser.json());

//cors might be better
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placeRouter);

app.use("/api/users", userRouter);

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Image = mongoose.model("Image", imageSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/uploads", upload.single("image"), async (req, res) => {
  try {
    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await newImage.save();
    res
      .status(201)
      .json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.use((req, res, next) => {
  const error = new Error("Could not find this route");
  console.log(error);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "Error Occurred" });
});

//Have to set Delete place, rest all are good
mongoose
  .connect(
    "mongodb+srv://karthikandroid16:AtamicX@cluster0.wu2r2.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
    console.log("Starting server");
  })
  .catch((err) => {
    console.log(err);
  });
