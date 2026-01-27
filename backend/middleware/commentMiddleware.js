import { commentController } from "../controllers/commentController.js";
import { httpErrorHandler } from "../utils/httpUtils.js";

export async function ensureCommentExists(req, res, next) {
    const commentId = req.params.commentId;
    const comment = await commentController.getCommentById(commentId);

    if(comment){
        req.comment = comment;
        next();
    }
    else {
        next(httpErrorHandler(404, "Comment not found"));
    }
}