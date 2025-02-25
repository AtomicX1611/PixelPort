import express from "express";

import {
  signUpUser,
  getAllUsers,
  loginUser,
} from "../controllers/user-controllers.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);

userRouter.post("/signup", signUpUser);

userRouter.post("/login", loginUser);

export default userRouter;
