module.exports = {
  apps: [
    {
      name: 'assets-server',
      script: 'D:/PROOO/backend-activos/build/index.js', // Ruta al archivo principal de tu aplicaci�n
      autorestart: true,
      watch: false,
    },
  ],
};