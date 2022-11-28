const express = require("express");
const router = express.Router();
const { getAllCartItem, createCartItem, getCartItemById, updateCartItem } = require("../db/cart_item");
const { requireUser } = require('./utils')

// POST api/cart_item
router.post("/", requireUser, async (req, res, next) => {
    const { productId, cartId, price, quantity  } = req.body;
    const cartItemData = {};
  
    try {
      cartItemData.authorId = req.user.id;
      cartItemData.productId = productId;
      cartItemData.cartId = cartId;
      cartItemData.price = price;
      cartItemData.quantity = quantity;
  
      const cartItem = await createCartItem(cartItemData);
  
      if (cartItem) {
        res.send({ cartItem });
      } else {
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// GET api/cart_item
router.get("/", async (req, res, next) => {
    try {
      const cartItem = await getAllCartItem();
      const cart = cartItem.filter((post) => {
        if (post.active) {
          return true;
        }
      });
      res.send({
        cart,
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// DELETE api/cart_item
router.delete('/:cartId', requireUser, async (req, res, next) => {
    try {
      const cartItem = await getCartItemById(req.params.cartId)
      
      if(cartItem && cartItem.author.id === req.user.id) {
        const deleteCartItem = await updateCartItem(cartItem.id, {active: false});
        res.send({cartItem: deleteCartItem})
      } else {
        next({
          name: "UnauthorizedUserError",
          message: "cannot delete a cart that is not yours"
        })
      }
      
    } catch ({name, message}) {
      next({name, message})
    }
  })