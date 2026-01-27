import { httpErrorHandler } from "../utils/httpUtils.js";
import { authController } from "../controllers/authController.js";
import { userController } from "../controllers/userController.js";

export function enforceAuthentication(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(httpErrorHandler(401, "Missing or invalid Authorization header"));
  }

  const token = authHeader.split(" ")[1];

  authController.isTokenValid(token, async (err, decodedToken) => {
    if (err) {
      next(httpErrorHandler(401, "Unauthorized"));
    } else {
        const user = await userController.getUserById(decodedToken.sub);
          if (!user) {
            next(httpErrorHandler(401, "Unauthorized"));
          }
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

export async function ensureUserModifyOnlyOwnComments(req, res, next) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  const isAuthorized = await authController.canUserModifyComment(userId, commentId);

  if (isAuthorized) {
    next();
  } else {
    next(httpErrorHandler(403, "Forbidden! You do not have permissions to view or modify this resource"));
  }
}

export async function ensureUserModifyOnlyOwnVotes(req, res, next) {
  const userId = req.userId;
  const voteId = req.params.voteId;
  const isAuthorized = await authController.canUserModifyVote(userId, voteId);

  if (isAuthorized) {
    next();
  } else {
    next(httpErrorHandler(403, "Forbidden! You do not have permissions to view or modify this resource"));
  }
}

export async function ensureUserModifyOnlyOwnProfile(req, res, next) {
  const userId = req.params.userId;
  const loggedUserId = req.userId;
  const isAuthorized = await authController.canUserModifyProfile(userId, loggedUserId);

  if (isAuthorized) {
    next();
  } else {
    next(httpErrorHandler(403, "Forbidden! You do not have permissions to view or modify this resource"));
  }
}