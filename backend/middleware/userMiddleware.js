import { userController } from "../controllers/userController.js";
import { httpErrorHandler } from "../utils/httpUtils.js";


export async function ensureUserExists(req, res, next) {
    const user = await userController.getUserById(req.params.userId);

    if (!user) {
        next(httpErrorHandler(404, "User not found"));
    }

    req.userData = user;
    next();
}
