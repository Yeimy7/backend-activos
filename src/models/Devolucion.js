import * as Sequelize from 'sequelize'
import conexion from '../config/db'
import Activo from './Activo'
import Empleado from './Empleado'

const Devolucion = conexion.define('devolucion', {
  id_devolucion: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  fecha_devolucion: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  motivo_devolucion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fecha_asignacion: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  id_activo: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  id_persona: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Devolucion.sync()

Devolucion.belongsTo(Activo, { foreignKey: 'id_activo' })
Devolucion.belongsTo(Empleado, { foreignKey: 'id_persona' })

export default Devolucion