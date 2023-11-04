module.exports = {
  apps: [
    {
      name: 'assets-server',
      script: 'D:/PROOO/backend-activos/src/index.js', // Ruta al archivo principal de tu aplicación
      autorestart: true,
      watch: false,
    },
  ],
};