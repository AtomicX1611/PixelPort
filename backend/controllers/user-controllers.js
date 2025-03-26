import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
    console.log("Retrieved all users");
  } catch {
    const error = new Error("Couldnt get users");
    return next(error);
  }

  res.json({ message: users });
};

const signUpUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  let checkUser;

  try {
    checkUser = await User.findOne({ email: email });
  } catch {
    const error = new Error("Something went wrong");
    return next(error);
  }

  if (checkUser) {
    const error = new Error("Email already Used");
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log("Error Occurred ,Couldnt create user->  ", error.message);
    return next(error);
  }

  const user = new User({
    name,
    email,
    hashedPassword,
    image: req.file.path,
    places: [],
  });

  await user.save();

  let token;
  token = jwt.sign({ userId: user.id, email: user.email }, "XXX", {
    expiresIn: "1hr",
  });

  res.json({ userId: user.id, token });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ message: "Email and Password cannot be empty" });
  }
  console.log("Request Body:", req.body);
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch {
    const err = new Error("Couldnt find User");
    return next(err);
  }

  if (!user) {
    return res.status(404).json({ message: "User not in database : ", user });
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch {
    const error = new Error("Couldnt validate password");
    return next(error);
  }

  if (!isValidPassword) {
    const error = new Error("Incorrect password");
    return next(error);
  }

  let token;
  token = jwt.sign({ userId: user.id, email: user.email }, "XXX", {
    expiresIn: "1hr",
  });

  res.json({ message: "User logged in", token, userId: user.id });
};

export { getAllUsers, signUpUser, loginUser };
