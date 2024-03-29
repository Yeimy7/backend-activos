import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
import Piso from './Piso.js';
const Ambiente = conexion.define('ambiente', {
  id_ambiente: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  codigo_ambiente: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tipo_ambiente: {
    type: Sequelize.STRING,
    allowNull: false
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  },
  id_piso: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Ambiente.sync();
Ambiente.belongsTo(Piso, {
  foreignKey: 'id_piso'
});
export default Ambiente;