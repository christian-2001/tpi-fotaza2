import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Imagen } from "./Imagen.js";
import { Etiqueta } from "./Etiqueta.js";

export class Imagen_Etiqueta extends Model { }

Imagen_Etiqueta.init(
    {
        id_img: {
            type: DataTypes.INTEGER,
            references: {
                model: Imagen,
                key: "id_img",
            },
        },

        id_etiqueta: {
            type: DataTypes.INTEGER,
            references: {
                model: Etiqueta,
                key: "id_etiqueta",
            },
        },
    },
    {
        sequelize,
        modelName: "Imagen_Etiqueta",
        tableName: "imagen_etiqueta",
        createdAt: true,
        deletedAt: true,
    },
)