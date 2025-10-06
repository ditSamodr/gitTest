// knexfile.js
const dotenv =require('pg');

module.exports = {
  development: {
    client: 'pg', // or 'postgresql'
    connection: {
        host: 'localhost' || 'localhost',
        user: 'postgres',
        password: '123456',
        database: 'testdb',
      // Your connection details (host, user, password, database)
    },
    // 🚨 THIS IS THE CRITICAL SECTION 🚨
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations' // Ensure this path is a valid string, not null or undefined
    },
    // If you use seeds:
    seeds: {
      directory: './db/seeds'
    }
  },

  // other environments (staging, production, etc.)
};