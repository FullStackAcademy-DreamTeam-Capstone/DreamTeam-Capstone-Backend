const client = require("./client");

async function getAllProduct() {
  const { rows: products } = await client.query(`
    SELECT *
    FROM products
    WHERE active = true
    `);

  return products;
}

// async function getAllActiveProducts() {
//   const { rows: products } = await client.query(`
//     SELECT *
//     FROM products WHERE active=true
//     `);

//   return products;
// }
 
async function getProductById(id) {
  const {
    rows: [product],
  } = await client.query(`
    SELECT *
    FROM products
    WHERE id = ${id};
    `);

  return product;
}

async function getProductByName(name) {
  const reply = await client.query(
    `
    SELECT *
    FROM products
    WHERE name = $1;
    `,
    [name]
  );
  const {
    rows: [product],
  } = reply;

  return product;
}

async function createProduct({ name, price, img_url }) {
  try {
    const {
      rows: [createdProduct],
    } = await client.query(
      `
        INSERT INTO products(name, price, img_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `,
      [name, price, img_url]
    );

    return createdProduct;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, fields = {}) {

  const setString = Object.keys(fields)
  .map((elem, index) => `"${elem}"=$${index + 1}`)
  .join(", ");
  try {
    const reply = await client.query(
      `
      UPDATE products
      SET ${setString}
      WHERE id=${id}
  
  
      `,
      Object.values(fields)
    ); 
    return {success: true};
  } catch (error) {
    return {success: false};
  }
 
}


module.exports = {
  getAllProduct,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
};
