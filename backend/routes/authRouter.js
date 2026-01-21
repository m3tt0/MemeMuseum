import express from "express";
import { AuthController } from "../controllers/authController.js"; 
import { enforceAuthentication } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/login", (req, res, next) => {
    AuthController.login(req.body)
    .then( found => {
        const token = AuthController.issueToken(found);
        res.status(200).json({token});
    })
    .catch(next);
});

authRouter.post("/signup", (req, res, next) => {
    AuthController.signup(req.body)
    .then( user => {
        res.status(201).json({userId: user.userId, userName: user.userName});})
    .catch(next);
});


