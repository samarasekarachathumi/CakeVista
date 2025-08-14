import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AUTH_HEADER, BEARER_PREFIX, EMPTY_STRING } from '../constant/auth.js';

dotenv.config();

const authenticate = (req, res, next) => {
  const value = req.header(AUTH_HEADER);

  if (!value) {
    return next();
  }

  const token = value.replace(BEARER_PREFIX, EMPTY_STRING);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    next();
  });
};

export default authenticate;
