import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;
  const searchTerm = req.query.search || '';
  const filter = req.query.filter || 'all';

  try {
    // Build search query
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Build filter query
    let filterQuery = {};
    if (filter === 'popular') {
      filterQuery = { places: { $exists: true, $not: { $size: 0 } } };
    } else if (filter === 'new') {
      filterQuery = { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } };
    }

    // Combine search and filter queries
    const finalQuery = {
      ...searchQuery,
      ...filterQuery
    };

    const users = await User.find(finalQuery)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skipIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments(finalQuery);
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
  console.log("Calling signing up user : ", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
      places: [],
    });

    await user.save();

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({ userId: user.id, token });
  } catch (error) {
    console.log("Error creating user:", error.message);
    return next(new Error("Something went wrong while creating user"));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "User logged in", token, userId: user.id });
  } catch (error) {
    console.log("Login error:", error.message);
    return next(new Error("Could not log in user"));
  }
};

export { getAllUsers, signUpUser, loginUser };
