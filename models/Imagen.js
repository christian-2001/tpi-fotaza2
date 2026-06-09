import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";

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
            type: DataTypes.STRING
        },

        copyright: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        extension: {
            type: DataTypes.STRING,
            allowNull: false
        },

        cant_votaciones: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        cant_valorizaciones: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        prom_valorizaciones: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },

        id_post: {
            type: DataTypes.INTEGER,
            references: {
                model: Publicacion,
                key: "id_post"
            }
        },

        comentarios_cerrados: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },

    {
        sequelize,
        timestamps: false,
        modelName: "Imagen",
        tableName: "imagen",
        deletedAt: true,
    }
)