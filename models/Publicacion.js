import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Usuario } from "./Usuario.js";

export class Publicacion extends Model { }

Publicacion.init(
    {
        id_post: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: "PublicacionUnica",
        },

        fh_publicacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            unique: "PublicacionUnica",
        },

        titulo: {
            type: DataTypes.STRING()
        },

        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: "Ninguna"
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
        timestamps: true,
        modelName: "Publicacion",
        tableName: "publicacion",
        createdAt: "fh_publicacion",
        updatedAt: "fh_edit_publicacion",
        deletedAt: true,
    }
)