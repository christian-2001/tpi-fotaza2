import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Persona extends Model { }

Persona.init(
  {
    id_persona: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },

    dni: {
      type: DataTypes.STRING(8),
      unique: "PersonaUnica"
      //primaryKey: true,
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