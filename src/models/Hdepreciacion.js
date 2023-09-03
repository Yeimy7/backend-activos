import * as Sequelize from 'sequelize'
import conexion from '../config/db.js'
import Activo from './Activo.js'
import ValorUfv from './ValorUfv.js'

const Hdepreciacion = conexion.define('hdepreciacion', {
  id_hdepreciacion: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  valor_residual: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  id_activo: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  id_valor_ufv: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Hdepreciacion.sync()

Hdepreciacion.belongsTo(Activo, { foreignKey: 'id_activo' })
Hdepreciacion.belongsTo(ValorUfv, { foreignKey: 'id_valor_ufv' })

export default Hdepreciacion;