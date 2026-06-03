import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Persona } from "./Persona.js";

export class Usuario extends Model { }

Usuario.init(
    {

        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: "UsuarioUnico"
        },

        nombre_usuario: {
            type: DataTypes.STRING(50),
            unique: "UsuarioUnico",
        },

        contrasenia: {
            type: DataTypes.STRING
        },
        
        cant_publicaciones: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        cant_seguidores: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        cant_seguidos: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        estado_cuenta: {
            type: DataTypes.STRING,
            defaultValue: "Activo"
        },

        id_persona: {
            type: DataTypes.INTEGER,
            references: {
                model: Persona,
                key: "id_persona"
            }
        }
    },
    
    {
        sequelize,
        modelName: "Usuario",
        tableName: "usuario",
        createdAt: true,
        deletedAt: true,
    }
)