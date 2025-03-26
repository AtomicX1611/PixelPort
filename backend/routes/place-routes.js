import express from "express";
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from "../controllers/place-controllers.js";
import fileUpload from "../middlewares/fileUpload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const placeRouter = express.Router();

placeRouter.get("/user/:uid", getPlacesByUserId); 
placeRouter.get("/:pid", getPlaceById); 

placeRouter.use(authMiddleware)

placeRouter.post("/",fileUpload.single("image"), createPlace);  
placeRouter.patch("/:pid", updatePlace); 
placeRouter.delete("/:pid", deletePlace); 


export default placeRouter;
