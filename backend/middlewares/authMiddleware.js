import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split("")[1];
  if (!token) {
    return next(new Error("Authentication failed"));
  }
  decodedToken = jwt.verify(token,'XXX')
  req.userData = decodedToken.userId
  next();
};
