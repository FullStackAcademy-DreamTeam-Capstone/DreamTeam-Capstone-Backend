const { Client } = require('pg'); 

const client = new Client(process.env.DATABASE_URL || 'https://localhost:5432/capstoneServer');

module.exports = client