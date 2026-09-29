import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js"

export class Motivo extends Model { }

Motivo.init(
    {
        id_motivo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },

    {
        sequelize,
        modelName: "Motivo",
        tableName: "motivo",
    }
)