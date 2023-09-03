import * as Sequelize from 'sequelize'
import conexion from '../config/db.js'

const Proveedor = conexion.define('proveedor', {
  id_proveedor: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  razon_social: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  encargado: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  telefono: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue:'A',
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
})

Proveedor.sync()

export default Proveedor