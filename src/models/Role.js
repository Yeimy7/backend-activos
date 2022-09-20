import * as Sequelize from 'sequelize'
import conexion from '../config/db'

const Role = conexion.define('rol', {
  id_rol: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  nombre_rol: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  timestamps: false
})
Role.sync()

export default Role