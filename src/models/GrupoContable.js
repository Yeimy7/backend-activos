import * as Sequelize from 'sequelize'
import conexion from '../config/db'

const GrupoContable = conexion.define('grupo_contable', {
  id_grupo: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  vida_util: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  coeficiente: {
    type: Sequelize.FLOAT,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  timestamps: false,
})

GrupoContable.sync()

export default GrupoContable