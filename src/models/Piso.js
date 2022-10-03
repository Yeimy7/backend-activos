import * as Sequelize from 'sequelize'
import conexion from '../config/db'
import Edificio from './Edificio'

const Piso = conexion.define('piso', {
  id_piso: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  codigo_piso: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id_edificio: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Piso.sync()

Piso.belongsTo(Edificio, { foreignKey: 'id_edificio' })

export default Piso