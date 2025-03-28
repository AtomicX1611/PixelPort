import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new Error("Authentication failed"));
  }

  console.log("Token : ", token);
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "XXX");
  } catch (error) {
    console.log("Exception : ", error);
    return next(new Error(" Token couldnt be verified"));
  }

  req.userData = decodedToken.userId;
  next();
};
