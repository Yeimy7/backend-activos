import * as Sequelize from 'sequelize'
import conexion from '../config/db'

const Edificio = conexion.define('edificio', {
  id_edificio: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  nombre_edificio: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Edificio.sync()

export default Edificio