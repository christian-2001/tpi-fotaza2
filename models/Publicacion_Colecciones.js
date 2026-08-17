import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";
import { Colección } from "./Colección.js" 

export class Publicacion_Colecciones extends Model { }

Publicacion_Colecciones.init(
  {
    id_post: {
      type: DataTypes.INTEGER,
      references: {
        model: Publicacion,
        key: "id_post",
      },
    },

    id_colección: {
      type: DataTypes.INTEGER,
      references: {
        model: Colección,
        key: "id_colección"
      }
    },

    fh_guardado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Publicacion_Colecciones",
    tableName: "publicacion_colecciones",
    createdAt: "fh_guardado",
    deletedAt: true,
  },
)