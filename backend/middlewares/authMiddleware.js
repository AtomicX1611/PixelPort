import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return next(new Error("Authentication failed"));
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    return next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return next(new Error("Token verification failed"));
  }
};
