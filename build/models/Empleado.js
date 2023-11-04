import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
import Cargo from './Cargo.js';
const Empleado = conexion.define('empleado', {
  id_persona: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  fecha_incorporacion: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  },
  id_cargo: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Empleado.sync();
Empleado.belongsTo(Cargo, {
  foreignKey: 'id_cargo'
});
export default Empleado;