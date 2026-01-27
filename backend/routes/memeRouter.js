import express from "express";
import { memeController } from "../controllers/memeController.js";
import { ensureUsersModifyOnlyOwnMemes } from "../middleware/authMiddleware.js";
import { ensureMemeExists } from "../middleware/memeMiddleware.js";


export const memeRouter = new express.Router();


//creazione di un nuovo meme
memeRouter.post("/memes", (req, res, next) => {
    memeController.newMeme(req.body, req.userId)
    .then( result => {
        res.json(result);
    })
    .catch(err => {
        next(err);
    });
});

//eliminazione di un meme esistente
memeRouter.delete("/memes/:memeId", ensureMemeExists, ensureUsersModifyOnlyOwnMemes, (req, res, next) => {
    memeController.deleteMeme(req.params.memeId)
    .then( result => {
        res.json(result);
    })
    .catch(err => {
        next(err);
    });
});

//aggiornamento di un meme esistente
memeRouter.put("/memes/:memeId", ensureMemeExists, ensureUsersModifyOnlyOwnMemes, (req, res, next) => {
    memeController.updateMeme(req.params.memeId, req.body)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});


memeRouter.get("/memes/search", (req, res, next) => {
    memeController.searchMemes(req.query)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

memeRouter.get("/memes/daily", (req, res, next) => {
    memeController.getDailyMemes()
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});