import Sequelize from 'sequelize'
import * as config from './config.js'

//Parametros para la conexion a la base de datos
const conectarDB = new Sequelize(
  config.DB_DATABASE,
  config.DB_USER,
  config.DB_PASS,
  {
    host: config.DB_HOST,
    dialect: 'mysql',
  })
export default conectarDB