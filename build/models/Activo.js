import * as Sequelize from 'sequelize';
import conexion from '../config/db.js';
import Ambiente from './Ambiente.js';
import Auxiliar from './Auxiliar.js';
import Empleado from './Empleado.js';
import GrupoContable from './GrupoContable.js';
import Proveedor from './Proveedor.js';
const Activo = conexion.define('activo', {
  id_activo: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  codigo_activo: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fecha_ingreso: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  descripcion_activo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  costo: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  valor_residual: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  indice_ufv: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  img_activo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  },
  fecha_asig_ambiente: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW,
    allowNull: true
  },
  fecha_asig_empleado: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  id_ambiente: {
    type: Sequelize.UUID,
    allowNull: false
  },
  id_persona: {
    type: Sequelize.UUID,
    allowNull: true
  },
  id_auxiliar: {
    type: Sequelize.UUID,
    allowNull: false
  },
  id_grupo: {
    type: Sequelize.UUID,
    allowNull: false
  },
  id_proveedor: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
Activo.sync();
Activo.belongsTo(Ambiente, {
  foreignKey: 'id_ambiente'
});
Activo.belongsTo(Empleado, {
  foreignKey: 'id_persona'
});
Activo.belongsTo(Auxiliar, {
  foreignKey: 'id_auxiliar'
});
Activo.belongsTo(GrupoContable, {
  foreignKey: 'id_grupo'
});
Activo.belongsTo(Proveedor, {
  foreignKey: 'id_proveedor'
});
export default Activo;