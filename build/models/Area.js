import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
const Area = conexion.define('area', {
  id_area: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  nombre_area: {
    type: Sequelize.STRING,
    allowNull: false
  },
  codigo_area: {
    type: Sequelize.STRING,
    allowNull: false
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Area.sync();
export default Area;