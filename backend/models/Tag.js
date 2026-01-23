import { DataTypes } from "sequelize";

export function createModel(database){
    database.define("Tag", {
        tagId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false,
    }
)
}