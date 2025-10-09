import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;

  try {
    const users = await User.find({})
      .select('-password') // Exclude password from response
      .sort({ _id: -1 }) // Sort by newest first
      .skip(skipIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments({});
    const hasMore = skipIndex + users.length < totalUsers;

    res.json({
      message: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      hasMore: hasMore,
      totalUsers: totalUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    const err = new Error("Couldn't get users");
    return next(err);
  }
};

const signUpUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log("Calling signing up user : ",req.body)
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
    password : hashedPassword,
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
