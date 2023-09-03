import * as Sequelize from 'sequelize'
import conexion from '../config/db.js'

const ValorUfv = conexion.define('valor_ufv', {
  id_valor_ufv: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  gestion: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  valor: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

ValorUfv.sync()

export default ValorUfv;