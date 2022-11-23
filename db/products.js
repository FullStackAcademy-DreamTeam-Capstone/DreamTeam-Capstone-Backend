const client = require('./client')
const {getUserById} = require('./users')

async function getAllProduct(){
    const {rows: [product]} = await client.query(`
    SELECT *
    FROM products
    `);

    return product;
}

async function getProductById(id){
    const {rows: [product]} = await client.query(`
    SELECT *
    FROM products
    WHERE id = ${id};
    `);

    return product;
}

async function getProductByName(name){
    const {rows: [product]} = await client.query(`
    SELECT *
    FROM products
    WHERE name = ${name};
    `);

    return product;
}

async function createProduct(name, price){
    const {rows: [createdProduct]} = await client.query(`
    INSERT INTO products (name, price)
    VALUES ($1,$2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, price]);

    return createdProduct;
}

async function updateProduct({ id, ...fields }) {
    const setString = Object.keys(fields).map(
      (elem, index) => `"${elem}"=$${index + 1}`
    ).join(', ');
    const {rows: [updatedProduct]} = await client.query(`
    UPDATE product
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields))
    return updatedProduct;
  }

module.exports = {
    getAllProduct,
    getProductById,
    getProductByName,
    createProduct,
    updateProduct
}