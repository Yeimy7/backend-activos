import * as Sequelize from 'sequelize'
import conexion from '../config/db'
import Activo from './Activo'

const Hdepreciacion = conexion.define('hdepreciacion', {
  id_hdepreciacion: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  gestion: {
    type: Sequelize.INTEGER,
    // defaultValue: new Date().getFullYear(),
    allowNull: false,
  },
  valor_residual: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  id_activo: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Hdepreciacion.sync()

Hdepreciacion.belongsTo(Activo, { foreignKey: 'id_activo' })

export default Hdepreciacion;