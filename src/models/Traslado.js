import * as Sequelize from 'sequelize'
import conexion from '../config/db.js'
import Activo from './Activo.js'
import Ambiente from './Ambiente.js'

const Traslado = conexion.define('traslado', {
  id_traslado: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  fecha_traslado: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  motivo_traslado: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fecha_ocupacion_anterior: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  id_activo: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  id_ambiente: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Traslado.sync()

Traslado.belongsTo(Activo, { foreignKey: 'id_activo' })
Traslado.belongsTo(Ambiente, { foreignKey: 'id_ambiente' })

export default Traslado