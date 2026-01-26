import express from "express";
import { voteController, VoteController } from "../controllers/voteController.js";

const voteRouter = express.Router();

voteRouter.post("/votes/:memeId", async (req, res, next) => {
    voteController.newVote(req.body, req.userId, req.params.memeId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

voteRouter.delete("/votes/:voteId", async (req, res, next) => {
    voteController.deleteVote(req.params.voteId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});