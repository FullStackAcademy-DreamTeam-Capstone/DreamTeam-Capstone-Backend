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

async function canEditCart(cartId, userId){
    const {rows: [canEditCart]} = await client.query(`
    SELECT user.id
    FROM users
    WHERE id IN (SELECT user_id FROM cart WHERE id = ${cartId})
    `);

    return canEditCart.user.id === userId;
}

async function destroyCart(id){
    const {rows: [destroyedCart]} = await client.query(`
    DELETE FROM cart
    WHERE id = ${id}
    RETURNING *;
    `)

    return destroyedCart;
}

module.exports = {
    getCart,
    getCartById,
    createCart,
    updateCart,
    destroyCart,
    canEditCart
}