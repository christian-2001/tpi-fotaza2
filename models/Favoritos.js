import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Usuario } from "./Usuario.js";

export class Favoritos extends Model { }

Favoritos.init(
    {
        id_favoritos: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: "id_usuario"
            }
        }
    },

    {
        sequelize,
        modelName: "Favoritos",
        tableName: "favoritos",
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }
)