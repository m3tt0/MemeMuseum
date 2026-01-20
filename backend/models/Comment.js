import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define(
    "Comment",
    {
      commentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
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
          fields: ["memeId", "creationDate"],
        }
      ],
      timestamps: false,
    }
  );
}