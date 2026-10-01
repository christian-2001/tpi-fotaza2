import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";
import { Usuario } from "./Usuario.js";
import { Motivo } from "./Motivo.js";

export class DenunciaPublicacion extends Model { }

DenunciaPublicacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    id_post: {
      type: DataTypes.INTEGER,
      references: {
        model: Publicacion,
        key: "id_post"
      },
      unique: "DenunciaUnica"
    },

    id_denunciante: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: "id_usuario"
      },
      unique: "DenunciaUnica"
    },

    fh_denuncia: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    id_motivo: {
      type: DataTypes.INTEGER,
      references: {
        model: Motivo,
        key: "id_motivo"
      }
    },

    descripción: {
      type: DataTypes.STRING,
    },

    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente"
    }
  },
  {
    sequelize,
    modelName: "DenunciaPublicacion",
    tableName: "denuncia_publicacion",
    createdAt: "fh_denuncia",
    deletedAt: true,
  },
)