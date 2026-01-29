import express from "express";
import { userController } from "../controllers/userController.js";
import { ensureUserModifyOnlyOwnProfile } from "../middleware/authMiddleware.js";
import { uploadProfile } from "../middleware/uploadProfilePicture.js";



export const userRouter = new express.Router();

userRouter.get("/users/:userId", (req, res, next) => {
    userController.getUserById(req.params.userId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

userRouter.delete("/users/:userId", ensureUserModifyOnlyOwnProfile, (req, res, next) => {
    userController.deleteUser(req.params.userId)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

userRouter.put("/users/:userId/username", ensureUserModifyOnlyOwnProfile, (req, res, next) => {
    userController.updateUsername(req.params.userId, req.body.newUsername)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

userRouter.put("/users/:userId/password", ensureUserModifyOnlyOwnProfile, (req, res, next) => {
    userController.updatePassword(req.params.userId, req.body.oldPassword, req.body.newPassword)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});

userRouter.put("/users/:userId/profilePicture", ensureUserModifyOnlyOwnProfile, uploadProfile.single("profilePicture"), (req, res, next) => {
    const filePath = req.file ? req.file.path : null;
    
    userController.updateProfilePicture(req.params.userId, filePath)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    });
});


