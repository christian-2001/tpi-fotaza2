import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Usuario } from "./Usuario.js";

export class Seguidores extends Model { }

Seguidores.init(
    {
        id_seguidor: {
            type: DataTypes.INTEGER,
            unique: "SeguidoresUnico",
            references: {
                model: Usuario,
                key: "id_usuario"
            },
        },

        id_seguido: {
            type: DataTypes.INTEGER,
            unique: "SeguidoresUnico",
            references: {
                model: Usuario,
                key: "id_usuario"
            }
        }
    },
    {
        sequelize,
        modelName: "Seguidores",
        tableName: "seguidores",
        createdAt: true,
        deletedAt: true,
    }
)