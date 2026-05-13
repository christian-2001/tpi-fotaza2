import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";
import { Etiqueta } from "./Etiqueta.js";

export class Publicacion_Etiqueta extends Model { }

Publicacion_Etiqueta.init(
  {
    id_post: {
        type: DataTypes.INTEGER,
        references: {
            model: Publicacion,
            key: "id_post",
        },
    },
/*

    fh_publicacion: {
        type: DataTypes.DATE,
        references: {
            model: Publicacion,
            key: "fh_publicacion",
        },
    },
*/
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
    modelName: "Publicacion_Etiqueta",
    tableName: "publicacion_etiqueta",
    createdAt: true,
    deletedAt: true,
  },
)