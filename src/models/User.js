import * as Sequelize from 'sequelize'
import conexion from '../config/db.js'
import Role from './Role.js'
import bcrypt from 'bcryptjs'
import Person from './Person.js'

const User = conexion.define('usuario', {
  id_persona: {
    type: Sequelize.UUID,
    primaryKey: true,
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
  adicional: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  registro: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'A',
    allowNull: false
  },
  id_rol: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  reset_token: {
    type: Sequelize.STRING,
    allowNull: true,
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