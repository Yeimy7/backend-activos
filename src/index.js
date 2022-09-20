import app from './app'
import * as config from './config/config'
import * as logger from './utils/logger'
import conectarDB from './config/db'

// Conectar a la base de datos
const conexion = async () => {
  try {
      await conectarDB.authenticate()
      console.log('DB conectada');

  } catch (error) {
      console.error(error)
      process.exit(1) //Detener la app

  }
}
conexion()

// Arrancar la app
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})