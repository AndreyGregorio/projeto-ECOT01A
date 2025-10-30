const { Pool } = require('pg');
require('dotenv').config(); // Para carregar variáveis de ambiente

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'projeto',
  password: process.env.DB_PASSWORD || 'cssn',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;