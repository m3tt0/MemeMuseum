import express from "express";
import { commentController } from "../controllers/commentCotroller";
import { ensureCommentExists } from "../middleware/commentMiddleware.js";
import { ensureMemeExists } from "../middleware/memeMiddleware.js";
import { ensureUserModifyOnlyOwnComments } from "../middleware/authMiddleware.js";

export const commentRouter = new express.Router();

commentRouter.post("/memes/:memeId/comments", ensureMemeExists, (req, res, next) => {
    commentController.newComment(req.body, req.userId, req.params.memeId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

commentRouter.delete("/comments/:commentId", ensureCommentExists, ensureUserModifyOnlyOwnComments, (req, res, next) => {
    commentController.deleteComment(req.params.commentId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

commentRouter.put("/comments/:commentId", ensureCommentExists, ensureUserModifyOnlyOwnComments, (req, res, next) => {
    commentController.updateComment(req.params.commentId, req.body)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

commentRouter.get("/memes/:memeId/comments", ensureMemeExists, (req, res, next) => {
    commentController.getCommentsByMeme(req.params.memeId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});