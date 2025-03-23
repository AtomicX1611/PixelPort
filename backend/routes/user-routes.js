import express from "express";

import {
  signUpUser,
  getAllUsers,
  loginUser,
} from "../controllers/user-controllers.js";
import fileUpload from "../middlewares/fileUpload.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);

userRouter.post("/signup", fileUpload.single("image"),signUpUser);

userRouter.post("/login", loginUser);

export default userRouter;
