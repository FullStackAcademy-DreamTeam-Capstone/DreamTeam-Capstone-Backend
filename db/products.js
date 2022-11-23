const client = require("./client");

async function getAllProduct() {
  const { rows: products } = await client.query(`
    SELECT *
    FROM products
    `);

  return products;
}

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

async function createProduct({ name, price }) {
  try {
    const {
      rows: [createdProduct],
    } = await client.query(
      `
        INSERT INTO products(name, price)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `,
      [name, price]
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
  console.log(setString);
  const {
    rows: [updatedProduct],
  } = await client.query(
    `
    UPDATE products
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
    Object.values(fields)
  );
  return updatedProduct;
}

module.exports = {
  getAllProduct,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
};
