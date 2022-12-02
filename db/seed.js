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


const { createCartItem } = require("./cart_item");



// testing createUser
async function testCreateUser() {
  try {
    console.log("user is being created");
    const andrew = await createUser({
      username: "andrewIsCool",
      password: "iLoveDogs",
      name: "andrew",
      location: "Georgia",
    });
    console.log("finished creating the user");
  } catch (error) {
    console.error("Error creating a user");
  }
}

// testing createAddress
async function testCreateAddress() {
  try {
    console.log("address is being created")
    const minh = await createAddress({
        email: "minhNguyen@yahoo.com",

      });
      console.log("finished creating the address")
      } catch (error) {
        console.error("Error creating a address")
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
      price VARCHAR(255) NOT NULL,
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
  // console.log("starting to test database");

  console.log("testing createUser");
  const result = await createUser({
    username: "andrewIsCool",
    password: "iLoveDogs",
    name: "andrew",
    location: "Georgia",
    email: "minhNguyen@yahoo.com",
  });

  console.log("result:", result);

  console.log("testing getAllUsers");
  const users = await getAllUsers();

  console.log("Result:", users);

  console.log("testing getUserById");
  const andrew = await getUserById(1);

  console.log("Result:", andrew);

  console.log("testing updateUser");
  const update = await updateUser(users[0].id, {
    username: "timothyIsCool",
    name: "timothy",
    location: "Ohio",
    email: "aandrew.myles@gmail.com",
    isadmin: true
  });
  console.log("Result:", update);

  console.log("testing create products");
  const productResult = await createProduct({
    name: "toy car",
    price: "99",
  });
  const productResults = await createProduct({
    name: "Bike",
    price: "30",
  });
  console.log("productResult", productResults);

  console.log("testing get all products");
  const products = await getAllProduct();
  console.log("Result", products);

  console.log("starting test on getProductById");
  const product1 = await getProductById(1);
  console.log("getProductById result", product1);

  // console.log("testing the update products");
  // const updatingProduct = await updateProduct(products[0].id, {
  //   name: "toy truck",
  //   price: "$30"
  // });
  // console.log("updateProduct test", updatingProduct);

  console.log("testing getProductByName");
  const productByName = await getProductByName("toy truck");
  console.log("finished getProductByName", productByName)

  console.log("testing createCart");
  const createdCart = await createCart(1);
  console.log("created cart:", createdCart);

  console.log("testing get cart")
  const getTheCart = await getCart();
  console.log("finished testing getCart", getTheCart)

  console.log("testing update cart")
  const updateTheCart = await updateCart(getTheCart[0].id, {
    user_id: "2"
  });
  console.log("finished testing updateCart", updateTheCart)

  console.log("testing getCartById")
  const getTheCartById = await getCartById(1);
  console.log("finished testing getCartById", getTheCartById)

  console.log("testing createCartItem")
  const createdCartItem = await createCartItem({
    "price": 1,
    "quantity": 3
  });

  console.log("finished testing createCartItem", createdCartItem)

  console.log("testing change quantity in cart");
  const changeTheQuantity = await changeQuantityInCart(1, 3);
  console.log("finished changing quantity", changeTheQuantity);

  console.log("testing delete item");
  const deletedCartItem = await deleteCartItem(1);
  console.log("finished deleting cart item", deletedCartItem);

  console.log("finished testing database");
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
