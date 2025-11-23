const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DB_URL); // Only connection string is needed

module.exports = sql;