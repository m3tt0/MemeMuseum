import { Comment, Meme} from "../models/MemeMuseumDB";
import { httpErrorHandler } from "../utils/httpUtils";


export class commentController {
    //Gestione delle richieste su /comments

    static async newComment(commentBody, userId, memeId){
        return Comment.create({
            content: commentBody.content,
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

    // Paginated fetch of comments for a meme
    // page = 1-based page number, pageSize = items per page (default 10, max 100)
    static async getCommentsByMeme(memeId, page = 1, pageSize = 10){
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            throw httpErrorHandler(404, "Meme not found");
        }

        page = parseInt(page, 10) || 1;
        pageSize = parseInt(pageSize, 10) || 10;
        if (page < 1 || pageSize < 1) {
            throw httpErrorHandler(400, "Invalid pagination parameters");
        }
        if (pageSize > 100) pageSize = 100;

        const offset = (page - 1) * pageSize;

        const { count, rows } = await Comment.findAndCountAll({
            where: { memeId },
            order: [["creationDate", "DESC"]],
            limit: pageSize,
            offset,
            include: [{
                model: User,
                attributes: ["userName"]
            }]
        });

        return {
            items: rows,
            total: count,
            page,
            pageSize,
            totalPages: Math.ceil(count / pageSize)
        };
    }























}
