const {createUser} = require('./')
const client = require('./client')

async function dropTables(){
  try {
    console.log("Dropping all tables...")
    await client.query(`
    DROP TABLE IF EXISTS products; 
    DROP TABLE IF EXISTS users;
    `)
    
    console.log("Finished dropping all tables...")  
  } catch (error) {
      console.error("Error dropping tables!")
      throw error;
  }  
  
}

async function createTables(){
  try {
    console.log("Creating tables...")
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL, 
      description TEXT NOT NULL
    );
    CREATE TABLE products (
      
    )
    `)
    console.log("Finished creating tables...")
  } catch (error) {
      console.error("Error building tables!")
      throw error;
  }
    
}


async function rebuildDB() {
    try {
      await dropTables()
      await createTables()
    //   await createInitialUsers()
    //   await createInitialActivities()
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }
  
  module.exports = {
    rebuildDB,
    dropTables,
    createTables,
  }