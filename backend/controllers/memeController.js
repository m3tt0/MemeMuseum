import { Meme, Tag, Vote } from "../models/MemeMuseumDB.js";
import { Op, sequelize } from "sequelize";

export class memeController{
    //Gestione delle richieste su /memes

    static async newMeme(memeBody, userId){
        return Meme.create({
            caption: memeBody.caption,
            imagePath: memeBody.imagePath,
            userId: userId
        });
    }

    static async deleteMeme(memeId){
        return new Promise ((resolve, reject) => {
            this.getMemeById(memeId).then( meme => {
                meme.destroy().then(() => {resolve(meme)})
            })
        });
    }

    static async updateMeme(memeId, updatedMemeBody){
        return new Promise ((resolve, reject) => {
            this.getMemeById(memeId).then( meme => {
                meme.update(updatedMemeBody).then(() => {resolve(meme)})
            })
        });
    }

    static async getMemeById(memeId){
        return Meme.findByPk(memeId);    
    }



    static async searchMemes(filters) {
        const { tag, text, from, to, sort, page = 1, limit = 10, userId } = filters;

        const where = {};
        const include = [];

        if (text) {
            where.caption = { [Op.like]: `%${text}%` };
        }

        if (from || to) {
            where.creationDate = {};
            if (from) where.creationDate[Op.gte] = new Date(from);
            if (to) where.creationDate[Op.lte] = new Date(to);
        }

        if (userId) {
            where.userId = userId;
        }

        if (tag) {
            include.push({
                model: Tag,
                where: { name: tag }, // CORRETTO
                required: true
            });
        }

        let order = [["creationDate", "DESC"]];

        // Sorting "top" con somma voti
        if (sort === "top") {
            include.push({
                model: Vote,
                attributes: []
            });

            order = [[literal("SUM(CASE WHEN Votes.voteType = 1 THEN 1 ELSE 0 END)"), "DESC"]];
        }

        const offset = (page - 1) * limit;

        return Meme.findAll({
            where,
            include,
            order,
            group: ["Meme.memeId"],
            limit,
            offset
        });
    }

    static async getDailyMemes(limit = 5) {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        return Meme.findAll({
            where: {
                creationDate: {
                    [Op.between]: [start, end]
                }
            },
            include: [{
                model: Vote,
                attributes: []
            }],
            attributes: {
                include: [[sequelize.fn("SUM", sequelize.literal("CASE WHEN Votes.voteType = 1 THEN 1 ELSE 0 END")), "upvotes"]]
            },
            subQuery: false,
            group: ["Meme.memeId"],
            order: [[sequelize.literal("upvotes"), "DESC"]],
            limit
        });
    }


}