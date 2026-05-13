import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Usuario extends Model { }

Usuario.init(
    {
        
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
/*
        nombre_usuario: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
*/
        perfil_descripcion: {
            type: DataTypes.STRING,
        },

        cant_publicaciones: {
            type: DataTypes.INTEGER,
        },

        cant_seguidores: {
            type: DataTypes.INTEGER,
        },

        cant_seguidos: {
            type: DataTypes.INTEGER,
        },

        estado_cuenta: {
            type: DataTypes.BOOLEAN
        },
    },
    {
        sequelize,
        modelName: "Usuario",
        tableName: "usuario",
        createdAt: true,
        deletedAt: true,
    }
)