import express from "express";
import { authController } from "../controllers/authController.js";
import sanitizeHtml from "sanitize-html";

export const authRouter = new express.Router();

authRouter.post("/login", (req, res, next) => {
    authController.login(sanitizeHtml(req.body))
    .then( found => {
        const token = authController.issueToken(found);
        res.status(200).json({token});
    })
    .catch(next);
});

authRouter.post("/signup", (req, res, next) => {
    authController.signup(sanitizeHtml(req.body))
    .then( user => {
        res.status(201).json({userId: user.userId, userName: user.userName});})
    .catch(next);
});


