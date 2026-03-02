import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";

export const authMiddleware = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return next(new HttpError("Server misconfiguration: missing JWT secret", 500));
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return next(new HttpError("Authentication required", 401));
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    return next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return next(new HttpError("Invalid or expired token", 401));
  }
};
