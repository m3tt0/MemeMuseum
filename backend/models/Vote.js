import { DataTypes } from "sequelize";


export function createModel(database) {
  database.define( "Vote", {
    voteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      voteType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[1, -1]],
            msg: "Il tipo di voto deve essere 1 (upvote) o -1 (downvote).",
          },
        },
      },
      creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      memeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "memeId"],
          msg: "Un utente può votare un meme una sola volta.",
        },
        {
          fields: ["memeId"],
        }
      ],
      timestamps: false,
  } 
);
}
