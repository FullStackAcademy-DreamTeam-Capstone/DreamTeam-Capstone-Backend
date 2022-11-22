// const {createUser} = require('./users')
const client = require('./client')

async function dropTables(){
  try {
    console.log("Dropping all tables...")
    await client.query(`
    DROP TABLE IF EXISTS users;
    `);
    
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
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name VARCHAR(255) UNIQUE NOT NULL, 
      location VARCHAR(255) NOT NULL
    );
    `)
    console.log("Finished creating tables...")
  } catch (error) {
      console.error("Error building tables!")
      throw error;
  }
    
}


async function rebuildDB() {
    try {
      client.connect()
      await dropTables()
      await createTables()
  
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }

  async function testDB() {
    console.log("hello World")
  }
  
  rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());