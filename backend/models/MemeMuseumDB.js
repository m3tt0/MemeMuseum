import { Sequelize } from "sequelize";
import { createModel as createCommentModel } from "./Comment.js";
import { createModel as createMemeModel } from "./Meme.js";
import { createModel as createTagModel } from "./Tag.js";
import { createModel as createUserModel } from "./User.js";
import { createModel as createVoteModel } from "./Vote.js";

import 'dotenv/config';

//creando connessione al database tramite .env
export const database = new Sequelize(process.env.DB_CONNECTION_URI, 
    {
        dialect: process.env.DIALECT
    }
);

createCommentModel(database);
createMemeModel(database);
createTagModel(database);
createUserModel(database);
createVoteModel(database);

export const {Comment, Meme, Tag, User, Vote} = database.models;

//associazioni tra le entità

//User - Meme (1 - N)
Meme.User = Meme.belongsTo(User, { foreignKey: {name: "userId", allowNull: false} });
User.Memes = User.hasMany(Meme, {onDelete: "CASCADE"}, { foreignKey: {name: "userId", allowNull: false} });

//User - Comment (1 - N)
Comment.User = Comment.belongsTo(User, { foreignKey: {name: "userId", allowNull: false}});
User.Comments = User.hasMany(Comment, {onDelete: "CASCADE"}, { foreignKey: {name: "userId", allowNull: false}});

//User - Vote (1 - N)
Vote.User = Vote.belongsTo(User, { foreignKey: {name: "userId", allowNull: false}});
User.Votes = User.hasMany(Vote, {onDelete: "CASCADE"}, { foreignKey: {name: "userId", allowNull: false}});

//Meme - Tag (N - N)
Tag.Memes = Tag.belongsToMany(Meme, {through: "MemeTags", foreignKey: {name: "tagId", allowNull: false}, otherKey: "memeId"});
Meme.Tags = Meme.belongsToMany(Tag, { through: "MemeTags", foreignKey: {name: "memeId", allowNull: false}, otherKey: "tagId"});

//Meme - Comment (1 - N)
Comment.Meme = Comment.belongsTo(Meme, {foreignKey: {name: "memeId", allowNull: false}});
Meme.Comments = Meme.hasMany(Comment, {onDelete: "CASCADE"}, {foreignKey: {name: "memeId", allowNull: false}});

//Meme - Vote (1 - N)
Vote.Meme = Vote.belongsTo(Meme, {foreignKey: {name: "memeId", allowNull: false}});
Meme.Votes = Meme.hasMany(Vote, {onDelete: "CASCADE"}, {foreignKey: {name: "memeId", allowNull: false}});


//sincronizzazione dello schema demandata
//all'entrypoint del programma







