import { DataTypes } from "sequelize";

export function createModel(database){
    database.define("Meme", {
        memeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
        timestamps: false
    }
    )
}