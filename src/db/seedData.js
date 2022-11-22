const {} = require('./')
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
    console.log("Creating tables...")
    ///code goes here
    console.log("Finished creating tables...")
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