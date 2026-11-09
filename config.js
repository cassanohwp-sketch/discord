require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN || 'ISI_TOKEN_BOT_ANDA',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ykybazim_mantap',
    password: process.env.DB_PASSWORD || 'ykybazim_mantap',
    database: process.env.DB_NAME || 'ykybazim_mantap',
    port: process.env.DB_PORT || 3306
  },
  defaultColor: '#2563EB'
};