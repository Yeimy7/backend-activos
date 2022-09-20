import * as Sequelize from 'sequelize'
import conexion from '../config/db'
import Role from './Role'
import bcrypt from 'bcryptjs'
import Person from './Person'

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
  id_rol: {
    type: Sequelize.UUID,
    allowNull: false,
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