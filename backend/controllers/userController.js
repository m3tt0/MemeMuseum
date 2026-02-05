import { User, Meme, Comment, Vote } from "../models/MemeMuseumDB.js";
import bcrypt from "bcrypt";
import { httpErrorHandler } from "../utils/httpUtils.js";
import path from "path";
import fs from "fs/promises";

export class userController {

    static async getUserById(userId) { 
        const excludeFields = ['password'];
        return User.findByPk(userId, {attributes: {exclude: excludeFields}});
    }

    
    static async deleteUser(userId) {
        
        const deleteUser = await this.getUserById(userId);
        if (!deleteUser) {
            throw httpErrorHandler(404, "User not found");
        }
        else{
            await Meme.destroy({ where: { userId } });
            await Comment.destroy({ where: { userId } });
            await Vote.destroy({ where: { userId } });         
            await User.destroy({ where: { userId } });
        }

        return { message: "Account deleted successfully" };
    }

    
    static async updateUsername(userId, newUsername) {

        const exists = await User.findOne({ where: { userName: newUsername } });
        if (exists) {
            throw httpErrorHandler(409, "Username already in use");
        }

        return new Promise ( (resolve, reject) => {
            this.getUserById(userId).then( user => {
                user.update({userName: newUsername}).then( () => {resolve(user)})
            })
        });
    }

    
    static async updatePassword(userId, oldPwd, newPwd) {

        const user = await User.findByPk(userId);
                
        const ok = await bcrypt.compare(oldPwd, user.password);
        if (!ok) throw httpErrorHandler(401, "Old password is incorrect");
        else if (newPwd === oldPwd) throw httpErrorHandler(400, "New password must be different from the old one");

        const newHasedPwd = await bcrypt.hash(newPwd, 12);
        
        return new Promise ( (resolve, reject) => {
            user.update({password: newHasedPwd})
            .then( () => {resolve(user)}) 
        });
    }

    
    static async updateProfilePicture(userId, filePath) {
        const user = await this.getUserById(userId);
        const oldPicture = user.profilePicture;

        if(oldPicture){      
            await fs.unlink(path.resolve(oldPicture)).catch( err => {console.warn("Could not delete old profile image:", err.message); });
        }

        const normalizedPath = filePath.replace(/\\/g, "/");
        const userUpdated = await user.update({profilePicture: normalizedPath});

        return userUpdated;
    }
}
