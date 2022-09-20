import * as Sequelize from 'sequelize'
import conexion from '../config/db'
import Role from './Role'
import bcrypt from 'bcryptjs'

const User = conexion.define('usuario', {
  id_usuario: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  nombres: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  apellidos: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ci: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nacimiento: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  registro: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  id_rol: {
    type: Sequelize.UUID,
    // allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  hooks: {
    beforeCreate: (usuario) => {
      const salt = bcrypt.genSaltSync(10)
      usuario.password = bcrypt.hashSync(usuario.password, salt)
    }
  }
})

User.sync()

User.belongsTo(Role, { foreignKey: 'id_rol' })

export default User