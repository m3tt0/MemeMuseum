import { Vote } from "../models/MemeMuseumDB.js";
import { Sequelize } from "sequelize";
import { httpErrorHandler } from "../utils/httpUtils.js";

export class voteController {
    //Gestione delle richieste su /votes

    static async newVote(voteBody, userId, memeId){
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
            voteType: voteBody.voteType, 
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

    static async updateVote(updatedVoteBody, voteId){
        return new Promise ( (resolve, reject) => {
            this.getVoteById(voteId).then( vote => {
                vote.update(updatedVoteBody).then( () => {resolve(vote)})
            })
        });
    }

    static async getVoteById(voteId){
        return Vote.findByPk(voteId);    
    }

    static async getVotesByMeme(memeId){
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