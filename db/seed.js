// const {createUser} = require('./users')
const client = require("./client");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  getUser,
  getUserByUserName,
} = require("./users");

const {
  createProduct,
  getAllProduct,
  updateProduct,
  getProductById,
  getProductByName,
} = require("./products");
const { createCart, getCart, updateCart, getCartById } = require("./cart");

const { createCartItem, changeQuantityInCart, deleteCartItem } = require("./cart_item");



// testing createUser
async function testCreateUser() {
  try {

    const andrew = await createUser({
      username: "andrewIsCool",
      password: "iLoveDogs",
      name: "andrew",
      location: "Georgia",
    });

  } catch (error) {
    console.error("Error creating a user");
  }
}

// testing createAddress
async function testCreateAddress() {
  try {

    const minh = await createAddress({
        email: "minhNguyen@yahoo.com",

      });

      } catch (error) {
        console.error("Error creating a address")
      }
    }


async function dropTables() {
  try {

    await client.query(`
    DROP TABLE IF EXISTS cart_item;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    `);


  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      name VARCHAR(255) NOT NULL, 
      location VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      UNIQUE(username,email),
      isAdmin BOOLEAN DEFAULT false
    );
    `);

    await client.query(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      price VARCHAR(255) NOT NULL,
      img_url TEXT,
      active BOOLEAN DEFAULT true
    );
    `);

    await client.query(`
    CREATE TABLE cart (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      isActive BOOLEAN DEFAULT true
    );
    `);

    await client.query(`
    CREATE TABLE cart_item (
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "cartId" INTEGER REFERENCES cart(id),
      price VARCHAR(255),
      quantity INTEGER
    );
    `);


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

    throw error;
  }
}

async function testDB() {



  const result = await createUser({
    username: "andrewIsCool",
    password: "iLoveDogs",
    name: "andrew",
    location: "Georgia",
    email: "minhNguyen@yahoo.com",
  });


  const users = await getAllUsers();




  const andrew = await getUserById(1);




  const update = await updateUser(users[0].id, {
    username: "timothyIsCool",
    name: "timothy",
    location: "Ohio",
    email: "aandrew.myles@gmail.com",
    isadmin: true
  });



  const productResult = await createProduct({
    name: "toy car",
    price: "99",
  });
  const productResults = await createProduct({
    name: "Bike",
    price: "30",
  });



  const products = await getAllProduct();



  const product1 = await getProductById(1);



  const productByName = await getProductByName("toy truck");



  const createdCart = await createCart(1);



  const getTheCart = await getCart();



  const updateTheCart = await updateCart(getTheCart[0].id, {
    user_id: "2"
  });



  const getTheCartById = await getCartById(1);



  const createdCartItem = await createCartItem({
    "price": 1,
    "quantity": 3
  });




  const changeTheQuantity = await changeQuantityInCart(1, 3);



  const deletedCartItem = await deleteCartItem(1);



}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
