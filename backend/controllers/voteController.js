import { Vote } from '../models/models.js';
import { httpErrorHandler } from '../utils/httpUtils.js';

export class voteController {
    //Gestione delle richieste su /votes

    static async newVote(voteBody, userId, memeId){
        const existingVote = await this.getVoteById(voteBody.voteId);
        
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
        return Vote.findAll({
            where: {
                memeId: memeId
            }
        });
    }














}