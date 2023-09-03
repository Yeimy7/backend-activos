import * as Sequelize from 'sequelize'
import conexion from '../config/db.js'

const Person = conexion.define('persona', {
  id_persona: {
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
  telefono: {
    type: Sequelize.NUMBER,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
})

Person.sync()

export default Person