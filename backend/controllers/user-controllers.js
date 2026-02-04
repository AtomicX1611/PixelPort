import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";

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
    return next(new HttpError("Couldn't get users", 500));
  }
};

const signUpUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log("Calling signing up user : ", req.body);

  if (!JWT_SECRET) {
    return next(new HttpError("Server misconfiguration: missing JWT secret", 500));
  }

  if (!name || !email || !password) {
    return next(new HttpError("Name, email, and password are required", 400));
  }

  if (!req.file) {
    return next(new HttpError("Profile image is required", 400));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("Email already in use", 409));
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
    return next(new HttpError("Something went wrong while creating user", 500));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!JWT_SECRET) {
    return next(new HttpError("Server misconfiguration: missing JWT secret", 500));
  }

  if (!email || !password) {
    return next(new HttpError("Email and password are required", 400));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(new HttpError("Invalid credentials", 401));
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "User logged in", token, userId: user.id });
  } catch (error) {
    console.log("Login error:", error.message);
    return next(new HttpError("Could not log in user", 500));
  }
};

export { getAllUsers, signUpUser, loginUser };
