import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Comentario } from "./Comentario.js"
import { Usuario } from "./Usuario.js";
import { Motivo } from "./Motivo.js";

export class DenunciaComentario extends Model { }

DenunciaComentario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    id_comentario: {
      type: DataTypes.INTEGER,
      references: {
        model: Comentario,
        key: "id_comentario"
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

    descripcion: {
      type: DataTypes.STRING,
    },

    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente"
    }
  },
  {
    sequelize,
    modelName: "DenunciaComentario",
    tableName: "denuncia_comentario",
    createdAt: "fh_denuncia",
    deletedAt: true,
  },
)