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
    name: "Watch",
    price: "99",
    img_url: 'https://media.istockphoto.com/id/533714204/photo/businessman-checking-time-from-watch.jpg?s=612x612&w=0&k=20&c=bJN94WW68Rw8uEogp3GKtBYnhcrNFNnf1SkWb0KDvGo='
  });
  const productResults = await createProduct({
    name: "Bike",
    price: "30",
    img_url: 'https://www.bicycleretailer.com/sites/default/files/images/article/batch_lifestyle_bike_.jpg'
  });
  const productResult1 = await createProduct({
    name: "Car",
    price: "9,000",
    img_url: 'https://www.hdnicewallpapers.com/Walls/Big/Bugatti/Blue_Bugatti_Car_HD_Image.jpg'
  });

  const productResult2 = await createProduct({
    name: "PS5",
    price: "499",
    img_url: 'https://static2.gamerantimages.com/wordpress/wp-content/uploads/2020/10/ps5-3.jpg'
  });
  const productResult3 = await createProduct({
    name: "xbox",
    price: "99",
    img_url: 'https://assets.vg247.com/current/2020/12/SeriesS.jpg'
  });
  const productResult4 = await createProduct({
    name: "Gatorade",
    price: "3",
    img_url: 'https://images.hdsupplysolutions.com/image/upload/d_no_image.gif,f_auto,fl_lossy,h_600,q_auto,w_600/101971_w_MainProductImage_Lg.jpg'
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
