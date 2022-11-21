const {} = require('./')
const client = require('./client')

async function dropTables(){
    console.log("Dropping all tables...")
    ///code goes here
    console.log("Finished dropping all tables...")
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