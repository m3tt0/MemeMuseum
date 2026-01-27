import express from "express";
import { voteController } from "../controllers/voteController.js";
import { ensureMemeExists } from "../middleware/memeMiddleware.js";
import { ensureUserModifyOnlyOwnVotes } from "../middleware/authMiddleware.js";

export const voteRouter = express.Router();

voteRouter.post("/memes/:memeId/votes", ensureMemeExists, (req, res, next) => {
    voteController.newVote(req.body, req.userId, req.params.memeId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

voteRouter.delete("/votes/:voteId", ensureUserModifyOnlyOwnVotes, (req, res, next) => {
    voteController.deleteVote(req.params.voteId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

voteRouter.put("/memes/votes/:voteId", ensureUserModifyOnlyOwnVotes, (req, res, next) => {
    voteController.updateVote(req.body, req.params.voteId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

voteRouter.get("/memes/:memeId/votes", ensureMemeExists, (req, res, next) => {
    voteController.getVotesByMeme(req.params.memeId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});