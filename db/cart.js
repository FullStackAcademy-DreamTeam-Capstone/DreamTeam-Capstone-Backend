const client = require('./client')

async function getCart(){
    const {rows: [cart]} = await client.query(`
    SELECT *
    FROM cart;
    `);
    return cart;
}

async function getCartById(id){
    const {rows: [cart]} = await client.query(`
    SELECT *
    FROM cart
    WHERE id = ${id};
    `);

    return cart;
}

async function createCart(user_id){
    const {rows: [cart]} = await client.query(`
    INSERT INTO cart(user_id)
    VALUES($1)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING *;
    `, [user_id]);

    return cart;
}

async function updateCart({ id, ...fields }) {
    const setString = Object.keys(fields).map(
      (elem, index) => `"${elem}"=$${index + 1}`
    ).join(', ');
    const {rows: [updatedCart]} = await client.query(`
    UPDATE cart
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields))
    return updatedCart;
}

module.exports = {
    getCart,
    getCartById,
    createCart,
    updateCart
}