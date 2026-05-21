import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Persona extends Model { }

Persona.init(
  {
    dni: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      unique: "PersonaUnica"
    },

    tipo_dni: {
      type: DataTypes.STRING(40),
      unique: "PersonaUnica",
      //primaryKey: true,
    },

    sexo: {
      type: DataTypes.STRING(20),
      unique: "PersonaUnica",
      //primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(20),
    },

    apellido: {
      type: DataTypes.STRING(20),
    },

    mail: {
      type: DataTypes.STRING,
      unique: true,
    },

    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    sequelize,
    modelName: "Persona",
    tableName: "persona",
    createdAt: true,
    deletedAt: true,
  },
)