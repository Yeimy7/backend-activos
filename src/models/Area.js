
import * as Sequelize from 'sequelize'
import conexion from '../config/db'

const Area = conexion.define('area', {
    id_area: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    nombre_area: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    codigo_area: {
        type: Sequelize.STRING,
        allowNull:false
    }
}, {
    freezeTableName: true,
    timestamps: false
})
Area.sync()

export default Area