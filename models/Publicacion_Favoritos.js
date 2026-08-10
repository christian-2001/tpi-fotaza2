import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";
import { Favoritos } from "./Favoritos.js";

export class Publicacion_Favoritos extends Model { }

Publicacion_Favoritos.init(
  {
    id_post: {
      type: DataTypes.INTEGER,
      references: {
        model: Publicacion,
        key: "id_post",
      },
    },

    id_favoritos: {
      type: DataTypes.INTEGER,
      references: {
        model: Favoritos,
        key: "id_favoritos"
      }
    },

    fh_guardado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Publicacion_Favoritos",
    tableName: "publicacion_favoritos",
    createdAt: "fh_guardado",
    deletedAt: true,
  },
)