const { Pool } = require('pg');
require('dotenv').config(); // Carrega o .env

const pool = new Pool({
  // Isso vai ler a string "postgresql://postgres:cssn@localhost:5432/projeto"
  connectionString: process.env.DATABASE_URL, 
});

module.exports = pool;