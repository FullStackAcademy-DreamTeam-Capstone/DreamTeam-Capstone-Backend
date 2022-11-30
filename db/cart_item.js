const client = require('./client')

async function getAllCartItem(){
    const {rows: [cartItem]} = await client.query(`
    SELECT *
    FROM cart_item
    `);

    return cartItem;
}

async function getCartItemById(id){
    const {rows: [cartItem]} = await client.query(`
    SELECT *
    FROM cart_item
    WHERE id = ${id}
    `);

    return cartItem;
}

async function createCartItem({productId, cartId, price, quantity}){
    const {rows: [createdCartItem]} = await client.query(`
    INSERT INTO cart_item("productId", "cartId", price, quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [productId, cartId, price, quantity]);

    return createdCartItem;
}

async function updateCartItem(id, fields = {}){
    const setString = Object.keys(fields).map(
        (elem, index) => `"${elem}"=$${index + 1}`
      ).join(', ');
      const {rows: [updatedCartItem]} = await client.query(`
      UPDATE cart_item
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields))
      return updatedCartItem;
}

module.exports = {
    getAllCartItem,
    getCartItemById,
    createCartItem,
    updateCartItem
}