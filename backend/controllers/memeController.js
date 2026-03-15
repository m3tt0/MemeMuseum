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
    } = filters;

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const where = {};
    const include = [];

    /*
    * =========================
    * FILTRI SUL DATA E CAPTION
    * =========================
    */

    if (text !== undefined) {
      if (text.trim() === "") {
        throw httpErrorHandler(400, "Text filter cannot be empty!");
      }

      where.caption = {
        [Op.like]: `%${text}%`,
      };
    }

    if (from !== undefined) {
      if (isNaN(Date.parse(from))) {
        throw httpErrorHandler(400, "Invalid 'from' date format");
      }

      where.creationDate = where.creationDate || {};
      where.creationDate[Op.gte] = new Date(from);
    }

    if (to !== undefined) {
      if (isNaN(Date.parse(to))) {
        throw httpErrorHandler(400, "Invalid 'to' date format");
      }

      where.creationDate = where.creationDate || {};
      where.creationDate[Op.lte] = new Date(to);
    }

    /*
    * =========================
    * INCLUDE USER
    * =========================
    */

    if (username !== undefined) {
      if (username.trim() === "") {
        throw httpErrorHandler(400, "Username cannot be empty");
      }

      include.push({
        model: User,
        attributes: ["userId", "userName", "profilePicture"],
        where: { userName: username },
        required: true,
      });
    } else {
      include.push({
        model: User,
        attributes: ["userId", "userName", "profilePicture"],
      });
    }

    /*
    * =========================
    * INCLUDE TAGS
    * =========================
    */

    if (tag !== undefined) {
      const normalized = validateTagContent(tag);

      include.push({
        model: Tag,
        attributes: ["tagId", "content"],
        where: { content: normalized },
        through: { attributes: [] },
        required: true,
      });
    } else {
      include.push({
        model: Tag,
        attributes: ["tagId", "content"],
        through: { attributes: [] },
        required: false,
      });
    }

    /*
    * =========================
    * INCLUDE VOTES E COMMENTS
    * =========================
    *
    * Usiamo separate: true per evitare il casino delle join multiple
    * che duplicavano righe.
    */

    include.push({
      model: Vote,
      attributes: ["voteId", "voteType", "creationDate", "memeId", "userId"],
      separate: true,
      required: false,
      order: [["creationDate", "DESC"]],
    });

    include.push({
      model: Comment,
      attributes: ["commentId", "content", "creationDate", "memeId", "userId"],
      separate: true,
      required: false,
      order: [["creationDate", "DESC"]],
    });

    /*
    * =========================
    * ORDINAMENTO
    * =========================
    */

    let order;

    if (sort === "oldest") {
      order = [["creationDate", "ASC"]];
    } else if (sort === "top") {
      order = [[Sequelize.literal("upvotes"), "DESC"]];
    } else if (sort === "bottom") {
      order = [[Sequelize.literal("downvotes"), "DESC"]];
    } else {
      order = [["creationDate", "DESC"]];
    }

    return Meme.findAll({
      where,
      include,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM Votes
              WHERE Votes.memeId = Meme.memeId
                AND Votes.voteType = 1
            )`),
            "upvotes",
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM Votes
              WHERE Votes.memeId = Meme.memeId
                AND Votes.voteType = -1
            )`),
            "downvotes",
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM Comments
              WHERE Comments.memeId = Meme.memeId
            )`),
            "commentsCount",
          ],
        ],
      },
      order,
      limit: parsedLimit,
      offset,
      distinct: true,
    });
  }


static async getDailyMemes(limit = 5) {
  const parsedLimit = Number(limit) || 5;

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const threeDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 3
  );

  const buildQuery = (where = {}) => {
    return Meme.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["userId", "userName", "profilePicture"],
        },
        {
          model: Tag,
          attributes: ["tagId", "content"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Vote,
          attributes: ["voteId", "voteType", "creationDate", "memeId", "userId"],
          separate: true,
          required: false,
          order: [["creationDate", "DESC"]],
        },
        {
          model: Comment,
          attributes: ["commentId", "content", "creationDate", "memeId", "userId"],
          separate: true,
          required: false,
          order: [["creationDate", "DESC"]],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM Votes
              WHERE Votes.memeId = Meme.memeId
                AND Votes.voteType = 1
            )`),
            "upvotes",
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM Votes
              WHERE Votes.memeId = Meme.memeId
                AND Votes.voteType = -1
            )`),
            "downvotes",
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM Comments
              WHERE Comments.memeId = Meme.memeId
            )`),
            "commentsCount",
          ],
        ],
      },
      order: [
        [Sequelize.literal("upvotes"), "DESC"],
        ["creationDate", "DESC"],
      ],
      limit: parsedLimit,
      distinct: true,
    });
  };

  // 1) meme di oggi
  let memes = await buildQuery({
    creationDate: {
      [Op.gte]: startOfToday,
      [Op.lt]: startOfTomorrow,
    },
  });

  if (memes.length > 0) return memes;

  // 2) fallback: meme recenti degli ultimi 3 giorni
  memes = await buildQuery({
    creationDate: {
      [Op.gte]: threeDaysAgo,
      [Op.lt]: startOfTomorrow,
    },
  });

  if (memes.length > 0) return memes;

  // 3) fallback finale: top meme in generale
  return buildQuery();
}


}