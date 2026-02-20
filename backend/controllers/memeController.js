import { Meme, Tag, Vote, User, Comment, database } from "../models/MemeMuseumDB.js";
import { Op, Sequelize } from "sequelize";
import path from "path";
import fs from "fs/promises";
import { resolveTags , validateTagContent } from "../utils/tagUtils.js"
import { httpErrorHandler } from "../utils/httpUtils.js";

export class memeController{
    //Gestione delle richieste su /memes

    static async newMeme(memeBody, memePath, userId){
        return database.transaction(async (t) => {

                const meme = await Meme.create({
                    caption: memeBody.caption,
                    imagePath: memePath.replace(/\\/g, "/"),
                    userId: userId
                }, { transaction: t });

                if (memeBody.tags) {
                    const tags = Array.isArray(memeBody.tags) ? memeBody.tags : [memeBody.tags];
                    const tagIds = await resolveTags(tags, t);
                    await meme.setTags(tagIds, { transaction: t });
                }

                return meme;
            });
    }

    static async deleteMeme(memeId){
        return new Promise ((resolve, reject) => {
            this.getMemeById(memeId).then( meme => {
                if (meme.imagePath){
                    fs.unlink(path.resolve(meme.imagePath)).catch( err => {console.warn("Could not delete meme:", err.message);})
                }                
                meme.destroy().then(() => {resolve(meme)})                
            })
        });
    }

    static async updateMeme(memeId, updatedMemeBody){
        return new Promise ((resolve, reject) => {
            this.getMemeById(memeId).then( meme => {
                meme.update({caption: updatedMemeBody.caption}).then(() => {resolve(meme)})
            })
        });
    }

    static async getMemeById(memeId){
        return Meme.findByPk(memeId);    
    }



    static async searchMemes(filters) {
    const {
        tag,
        text,
        from,
        to,
        sort = "newest",
        page = 1,
        limit = 10,
        username,
        feed = false,
    } = filters;

    const offset = (page - 1) * limit;

    //feed per caricare il feed della homepage
    if (feed === true) {
        
        const order =
        sort === "oldest"
            ? [["creationDate", "ASC"]]
            : [["creationDate", "DESC"]];

        return Meme.findAll({
        where: {},                    
        include: [
            {
            model: User,              
            attributes: ["userName"],
            },
            {
            model: Vote,              
            attributes: [],
            },
            {
            model: Comment,
            },
            {
            model: Tag,
            }
        ],
        attributes: {
            include: [
            [
                Sequelize.literal(
                `SUM(CASE WHEN Votes.voteType = 1 THEN 1 ELSE 0 END)`
                ),
                "upvotes",
            ],
            [
                Sequelize.literal(
                `SUM(CASE WHEN Votes.voteType = -1 THEN 1 ELSE 0 END)`
                ),
                "downvotes",
            ],
            [
                Sequelize.fn("COUNT", Sequelize.col("Comments.commentId")),
                "commentsCount",
            ],
            ],
        },
        group: [
            "Meme.memeId",
            "User.userId",        
        ],
        order,
        limit,
        offset,
        subQuery: false,
        });
    }

    const where = {};
    const include = [];

    if (text !== undefined) {
        if (text.trim() === "")
        throw httpErrorHandler(400, "Text filter cannot be empty!");
        where.caption = { [Op.like]: `%${text}%` };
    }

    if (from !== undefined) {
        if (isNaN(Date.parse(from)))
        throw httpErrorHandler(400, "Invalid 'from' date format");
        where.creationDate = where.creationDate || {};
        where.creationDate[Op.gte] = new Date(from);
    }

    if (to !== undefined) {
        if (isNaN(Date.parse(to)))
        throw httpErrorHandler(400, "Invalid 'to' date format");
        where.creationDate = where.creationDate || {};
        where.creationDate[Op.lte] = new Date(to);
    }

    if (username !== undefined) {
        if (username.trim() === "")
        throw httpErrorHandler(400, "Username cannot be empty");
        include.push({
        model: User,
        where: { userName: username },
        required: true,
        });
    }

    if (tag !== undefined) {
        const normalized = validateTagContent(tag);
        include.push({
        model: Tag,
        where: { content: normalized },
        required: true,
        });
    }

    let order = [["creationDate", "DESC"]];
    const attributes = { include: [] };
    let group = ["Meme.memeId"];

    if (sort === "top") {
        include.push({ model: Vote, attributes: [] });
        attributes.include = [
        [
            Sequelize.literal(
            `SUM(CASE WHEN Votes.voteType = 1 THEN 1 ELSE 0 END)`
            ),
            "upvotes",
        ],
        ];
        group = ["Meme.memeId"];
        order = [[Sequelize.literal("upvotes"), "DESC"]];
    } else if (sort === "bottom") {
        include.push({ model: Vote, attributes: [] });
        attributes.include = [
        [
            Sequelize.literal(
            `SUM(CASE WHEN Votes.voteType = -1 THEN 1 ELSE 0 END)`
            ),
            "downvotes",
        ],
        ];
        group = ["Meme.memeId"];
        order = [[Sequelize.literal("downvotes"), "DESC"]];
    } else if (sort === "newest") {
        order = [["creationDate", "DESC"]];
    } else if (sort === "oldest") {
        order = [["creationDate", "ASC"]];
    }

    return Meme.findAll({
        where,
        include,
        attributes,
        group,
        order,
        limit,
        offset,
        subQuery: false,
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
                include: [[Sequelize.fn("SUM", Sequelize.literal("CASE WHEN Votes.voteType = 1 THEN 1 ELSE 0 END")), "upvotes"]]
            },
            subQuery: false,
            group: ["Meme.memeId"],
            order: [[Sequelize.literal("upvotes"), "DESC"]],
            limit
        });
    }


}