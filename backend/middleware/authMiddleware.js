import Jwt from "jsonwebtoken";
import { httpErrorHandler } from "../utils/httpUtils.js";

export function enforceAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(httpErrorHandler(401, "Missing or invalid Authorization header"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = Jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = {
      userId: payload.sub,
      userName: payload.userName
    };

    next();
  } catch (err) {
    next(httpErrorHandler(401, "Invalid or expired token"));
  }
}
