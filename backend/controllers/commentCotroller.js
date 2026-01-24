import { Comment, Meme} from "../models/MemeMuseumDB";
import { httpErrorHandler } from "../utils/httpUtils";


export class commentController {
    //Gestione delle richieste su /comments

    static async newComment(commentBody, userId, memeId){
        return Comment.create({
            ...commentBody,
            userId: userId,
            memeId: memeId
        });
    }

    static async deleteComment(commentId){
        return new Promise ( (resolve, reject) => {
            this.getCommentById(commentId).then( comment => {
                comment.destroy().then( () => {resolve(comment)})
            })
        });
    }

    static async updateComment(commentId, updatedCommentBody){
        let comment = await this.getCommentById(commentId);
        const timeLimit = 10 * 60 * 1000; // 10 minuti in millisecondi

        if(Date.now() - comment.creationDate.getTime() > timeLimit){
            throw httpErrorHandler(403, "Forbidden! You can no longer edit this comment.");
        }

        return new Promise ( (resolve, reject) => {
            this.getCommentById(commentId).then( comment => {
                comment.update(updatedCommentBody).then( () => {resolve(comment)})
            })
        });
    }

    static async getCommentById(commentId){
        return Comment.findByPk(commentId);    
    }

    static async getCommentsByMeme(memeId){
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            throw httpErrorHandler(404, "Meme not found");
        }
        
        return Comment.findAll({
            where: {
                memeId: memeId
            },
            order: [["creationDate", "DESC"]]
        });
    }























}
