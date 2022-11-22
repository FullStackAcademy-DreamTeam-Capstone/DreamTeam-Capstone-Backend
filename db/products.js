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

module.exports = {
    getAllProduct,
    getProductById,
    getProductByName
}