import sequelize from "../db/config.js";

export async function db_conexion() {
    try {
        await sequelize.authenticate()
        console.log("Se conectó a la bd")

        await sequelize.sync({ alter: true })
    } catch (error) {
        console.error("Error en la conexion a la base de datos", error)
        throw error
    }
}