import { User } from "../models/MemeMuseumDB.js";
import { httpErrorHandler } from "../utils/httpUtils.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthController{
    //Gestione delle richieste su /auth e controllo delle credenziali

    static async login (userBody){
        const {usr, pwd} = userBody;

        let found = await User.findOne({
            where: {
                userName: usr,
            }
        });

        if (!found) {
            throw httpErrorHandler(401, "Invalid credentials, please try again");
        }

        const ok_pwd = await bcrypt.compare(pwd, found.password);
        if (!ok_pwd) {
            throw httpErrorHandler(401, "Invalid credentials, please try again");
        }

        return found;
    }

    static async signup(userBody){
        const hashedPwd = await bcrypt.hash(userBody.pwd, 12);
        let user = new User({userName: userBody.usr, password: hashedPwd});
        let userAlreadyExist = await User.findOne({
            where: {
                userName: user.userName,
            }
        });

        if (userAlreadyExist){
            throw httpErrorHandler(409, "This username already exist, change it and try again !");
        }
        return user.save();
    }

    static issueToken(user){
        return Jwt.sign({
            sub: user.userId,
            userName: user.userName
        },
        process.env.TOKEN_SECRET, {expiresIn: '24h'});
    }



















}