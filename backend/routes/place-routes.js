import express from "express";
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
  getAllImages,
  getAllImagesBaseline,
  getAllImagesOptimized,
} from "../controllers/place-controllers.js";
import fileUpload from "../middlewares/fileUpload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const placeRouter = express.Router();

// Order matters: specific routes before parametric routes
placeRouter.get("/images/baseline", getAllImagesBaseline);
placeRouter.get("/images/optimized", getAllImagesOptimized);
placeRouter.get("/images", getAllImagesOptimized);
placeRouter.get("/user/:uid", getPlacesByUserId); 
placeRouter.get("/:pid", getPlaceById); // This should come last as it's a catch-all

placeRouter.use(authMiddleware)

placeRouter.post("/",fileUpload.single("image"), createPlace);  
placeRouter.patch("/:pid", updatePlace); 
placeRouter.delete("/:pid", deletePlace); 


export default placeRouter;
