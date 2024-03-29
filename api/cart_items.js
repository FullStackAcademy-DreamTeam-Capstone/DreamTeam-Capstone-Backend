const express = require("express");
const router = express.Router();
const {
  getAllCartItem,
  createCartItem,
  getCartItemById,
  updateCartItem,
} = require("../db/cart_item");
const { requireUser } = require("./utils");

router.use((req, res, next) => {
  console.log("PULLING FROM CART_ITEMS API");
  next();
});

// POST api/cart_item
router.post("/",  async (req, res, next) => {
  const { productId, cartId, price, quantity } = req.body;
  const cartItemData = {};

  try {
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

//UPDATE api/cart_item
router.patch("/:cartId", requireUser, async (req, res, next) => {
  const { cartItemId } = req.params;
  const { productId, cartId, price, quantity } = req.body;
  const updatedCart = {};

  if (productId) {
    updatedCart.productId = productId;
  }
  if (cartId) {
    updatedCart.cartId = cartId;
  }
  if (price) {
    updatedCart.price = price;
  }
  if (quantity) {
    updatedCart.quantity = quantity;
  }

  //console.log(updatedCart)

  try {
    const cartItem = await getCartItemById(cartItemId);

    if (cartItem.user.id === req.user.id) {
      const finalCartItem = await updateCartItem(cartId, updatedCart);
      res.send({ post: finalCartItem });
    } else {
      next({
        error: "number",
        name: "Item404Error",
        message: "Cart item does not exist.",
      });
    }
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
});

// GET api/cart_item
router.get("/", async (req, res, next) => {
  try {
    const cartItem = await getAllCartItem();
    res.send(
      cartItem
    );
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE api/cart_item
router.delete("/:cartId", requireUser, async (req, res, next) => {
  try {
    const cartItem = await getCartItemById(req.params.cartId);

    if (cartItem && cartItem.author.id === req.user.id) {
      const deleteCartItem = await updateCartItem(cartItem.id, {
        active: false,
      });
      res.send({ cartItem: deleteCartItem });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "cannot delete a cart that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;