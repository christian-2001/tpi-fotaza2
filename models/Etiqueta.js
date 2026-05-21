import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Etiqueta extends Model { }

Etiqueta.init(
    {
        id_etiqueta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: "EtiquetaUnica"
        },

        nom_etiqueta: {
            type: DataTypes.STRING,
            unique: true,
            unique: "EtiquetaUnica"
        }
    },
    
    {
        sequelize,
        modelName: "Etiqueta",
        tableName: "etiqueta",
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }
)