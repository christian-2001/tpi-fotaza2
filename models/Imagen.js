import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Imagen extends Model { }

Imagen.init(
    {
        id_img: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        nombre_img: {
            type: DataTypes.STRING,
        },

        img_path: {
            type: DataTypes.BLOB,
        },

        licencia: {
            type: DataTypes.BOOLEAN
        },

        cant_votaciones: {
            type: DataTypes.INTEGER
        },

        cant_valorizaciones: {
            type: DataTypes.INTEGER
        },

        prom_valorizaciones: {
            type: DataTypes.DOUBLE
        },
    },

    {
        sequelize,
        modelName: "Imagen",
        tableName: "imagen",
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }
)