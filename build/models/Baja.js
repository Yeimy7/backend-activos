import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
import Activo from './Activo.js';
const Baja = conexion.define('baja', {
  id_baja: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  fecha_baja: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  motivo_baja: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id_activo: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Baja.sync();
Baja.belongsTo(Activo, {
  foreignKey: 'id_activo'
});
export default Baja;