import { memeController } from "../controllers/memeController";
import { httpErrorHandler } from "../utils/httpUtils.js";

export async function ensureMemeExists(req, res, next) {
    const memeId = req.params.memeId;
    const meme = await memeController.getMemeById(memeId);

    if(meme){
        req.meme = meme;
        next();
    }
    else {
        next(httpErrorHandler(404, "Meme not found"));
    }
}