import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
const Auxiliar = conexion.define('auxiliar', {
  id_auxiliar: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  descripcion_aux: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Auxiliar.sync();
export default Auxiliar;