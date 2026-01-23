import express from "express";
import { authController } from "../controllers/authController.js";



authRouter.post("/login", (req, res, next) => {
    authController.login(req.body)
    .then( found => {
        const token = authController.issueToken(found);
        res.status(200).json({token});
    })
    .catch(next);
});

authRouter.post("/signup", (req, res, next) => {
    authController.signup(req.body)
    .then( user => {
        res.status(201).json({userId: user.userId, userName: user.userName});})
    .catch(next);
});


