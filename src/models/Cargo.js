import * as Sequelize from 'sequelize'
import conexion from '../config/db'
import Area from './Area'

const Cargo = conexion.define('cargo', {
  id_cargo: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  descripcion_cargo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  },
  id_area: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Cargo.sync()

Cargo.belongsTo(Area, { foreignKey: 'id_area' })

export default Cargo