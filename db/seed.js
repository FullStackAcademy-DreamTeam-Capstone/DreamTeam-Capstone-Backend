// const {createUser} = require('./users')
const client = require("./client");
const {
  createUser,
  getAllUsers
} = require('./users')

// testing createUser 
async function testCreateUser() {
  try {
    console.log("user is being created") 
    const andrew = await createUser({username: "andrewIsCool", password: "iLoveDogs", name: "andrew", location: "Georgia"});
    console.log("finished creating the user")
  } catch (error) {
    console.error('Error creating a user')
  }
}

async function dropTables() {
  try {
    console.log("Dropping all tables...");
    await client.query(`
    DROP TABLE IF EXISTS cart_item;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    `); 

    console.log("Finished dropping all tables...");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Creating tables...");
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name VARCHAR(255) UNIQUE NOT NULL, 
      location VARCHAR(255) NOT NULL
    );
    `);

    await client.query(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price VARCHAR(255) NOT NULL,
      img_url TEXT
    );
    `);

    await client.query(`
    CREATE TABLE cart (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      isActive BOOLEAN 
    );
    `);

    await client.query(`
    CREATE TABLE cart_item (
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "cartId" INTEGER REFERENCES cart(id),
      price INTEGER,
      quantity INTEGER
    );
    `);

    console.log("Finished creating tables...");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();


  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  console.log("starting to test database");

  console.log("testing createUser")
  const result = await createUser({username: "andrewIsCool", password: "iLoveDogs", name: "andrew", location: "Georgia"});
  console.log("result:", result)


  console.log("finished testing database")
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
