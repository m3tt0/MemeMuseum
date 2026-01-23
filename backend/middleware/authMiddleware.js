import { httpErrorHandler } from "../utils/httpUtils.js";
import { authController } from "../controllers/authController.js";

export function enforceAuthentication(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(httpErrorHandler(401, "Missing or invalid Authorization header"));
  }

  const token = authHeader.split(" ")[1];

  authController.isTokenValid(token, (err, decodedToken) => {
    if (err) {
      next(httpErrorHandler(401, "Unauthorized"));
    } else {
      req.userId = decodedToken.sub;
      req.userName = decodedToken.userName;
      next();
    }
  });
}

export async function ensureUsersModifyOnlyOwnMemes(req, res, next) {
  const userId = req.userId;
  const memeId = req.params.memeId;
  const isAuthorized = await authController.canUserModifyMeme(userId, memeId);

  if (isAuthorized) {
    next();
  } else {
    next(httpErrorHandler(403, "Forbidden! You do not have permissions to view or modify this resource"));
  }
}