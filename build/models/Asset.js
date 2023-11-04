// const Usuario = require('./Usuario')
import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
const Asset = conexion.define('asset', {
  id_activo: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  creado: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Asset.sync(); // Proyecto.belongsTo(Usuario, { foreignKey: 'creador' })

export default Asset;