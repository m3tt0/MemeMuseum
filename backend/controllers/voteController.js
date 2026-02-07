import { Vote } from "../models/MemeMuseumDB.js";
import { Sequelize } from "sequelize";
import { httpErrorHandler } from "../utils/httpUtils.js";
import sanitizeHtml from "sanitize-html";

export class voteController {
    //Gestione delle richieste su /votes

    static async newVote(voteBody, userId, memeId){
        userId = sanitizeHtml(userId);
        memeId = sanitizeHtml(memeId);
        const existingVote = await Vote.findOne({
            where: {
                userId: userId,
                memeId: memeId
            }
        });
        
        if (existingVote) {
            throw httpErrorHandler(409, "You have already voted for this meme.");
        }
        return Vote.create({
            voteType: sanitizeHtml(voteBody.voteType), 
            userId: userId,
            memeId: memeId
        });
    }

    static async deleteVote(voteId){
        return new Promise ( (resolve, reject) => {
            this.getVoteById(voteId).then( vote => {
                vote.destroy().then( () => {resolve(vote)})
            })
        });
    }

    static async updateVote(updatedVoteBody, voteId) {
        updatedVoteBody = sanitizeHtml(updatedVoteBody);
        const vote = await this.getVoteById(voteId);
        if (!vote) throw httpErrorHandler(404, "Vote not found");
        else if (vote.voteType === updatedVoteBody.voteType) throw httpErrorHandler(500, "You have already voted with this vote type!")
        return vote.update(updatedVoteBody);  
    }


    static async getVoteById(voteId){
        return Vote.findByPk(sanitizeHtml(voteId));    
    }

    static async getVotesByMeme(memeId){
        memeId = sanitizeHtml(memeId);
        const results = await Vote.findAll({
            where: { memeId },
            attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("voteId")), "total"],
                [
                    Sequelize.fn("SUM",
                        Sequelize.literal("CASE WHEN voteType = 1 THEN 1 ELSE 0 END")
                    ),
                    "upvotes"
                ],
                [
                    Sequelize.fn("SUM",
                        Sequelize.literal("CASE WHEN voteType = -1 THEN 1 ELSE 0 END")
                    ),
                    "downvotes"
                ]
            ]
        });

        return results[0].dataValues;
    }














}