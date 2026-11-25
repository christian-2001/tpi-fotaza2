import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";
import { Imagen } from "./Imagen.js";
import { Usuario } from "./Usuario.js";

export class Interes extends Model { }

Interes.init(
    {
        id_interes: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            
        },
        
        id_img: {
            type: DataTypes.INTEGER,
            references: {
                model: Imagen,
                key: "id_img"
            },
            unique: "InteresadoUnico"
        },

        id_interesado: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: "id_usuario"
            },
            unique: "InteresadoUnico"
        },

        id_autor: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: "id_usuario"
            }
        },

        fecha_interes: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        estado: {
            type: DataTypes.STRING,
            defaultValue: "activo"
        }
    },

    {
        sequelize,
        timestamps: false,
        modelName: "Interes",
        tableName: "interes",
        deletedAt: true,
    }
)