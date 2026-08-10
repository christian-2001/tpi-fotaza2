import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js"
import { Usuario } from "./Usuario.js"

export class Colección extends Model { }

Colección.init(
    {
        id_colección: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre_colección: {
            type: DataTypes.STRING,
            allowNull: false
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
        modelName: "Colección",
        tableName: "coleccion",
        deletedAt: true
    }
)