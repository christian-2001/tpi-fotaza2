import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Usuario } from "./Usuario.js";
import { Imagen } from "./Imagen.js";

export class Valorizacion extends Model { }

Valorizacion.init(
    {
        id_img: {
            type: DataTypes.INTEGER,
            unique: "ValorizacionUnica",
            references: {
                model: Imagen,
                key: "id_img",
            },
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            unique: "ValorizacionUnica",
            references: {
                model: Usuario,
                key: "id_usuario",
            }
        }
    },
    {
        sequelize,
        modelName: "Valorizacion",
        tableName: "valorizacion",
        createdAt: true,
        deletedAt: true,
    }
)