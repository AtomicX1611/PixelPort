import express from "express";
import bodyParser from "body-parser";
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

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

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


  // 'GET :- /api/users/ - getAllUsers.
  // 'POST :- /api/users/signup - signUpUser 
  // userModel -> 
// const User = new Schema(
//     {
//           name : {type : String , required : true},
//           email : {type : String , required : true, unique : true},
//           password : {type : String , required : true},
//           image : {type : String , required : true},
//           places : [{type : mongoose.Types.ObjectId ,required : true , ref : 'Place'}]
//     }
// ) image should be from multer 
// 'POST :- /api/users/login 

// "GET -: api/places/user/:uid" - getallplacesforuserId
// "GET "  api/places/:pi - getALlplaces
// "POST - api/places/" -createPlace "user multer to to upload image"
// "PATCH -: api/places/:pid" -updatePlace
// "DELETE -: api/places/:pid"  - deletePlace

//