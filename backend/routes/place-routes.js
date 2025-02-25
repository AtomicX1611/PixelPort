import express from "express";
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from "../controllers/place-controllers.js";

const placeRouter = express.Router();
placeRouter.post("/", createPlace); 
placeRouter.get("/:pid", getPlaceById); 
placeRouter.get("/user/:uid", getPlacesByUserId); 
placeRouter.patch("/:pid", updatePlace); 
placeRouter.delete("/:pid", deletePlace); 


export default placeRouter;
