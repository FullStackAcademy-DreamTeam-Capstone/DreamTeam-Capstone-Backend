const express = require("express");
const router = express.Router();
const {
  getCart,
  getCart,
  createCart,
  getCartById,
  updateCart,
} = require("../db/cart");
const { requireUser } = require("./utils");

// POST(CREATE CART) api/cart
router.post("/", requireUser, async (req, res, next) => {
  const { user_id, isActive } = req.body;
  const cartData = {};

  try {
    cartData.authorId = req.user.id;
    cartData.name = user_id;
    cartData.isActive = isActive;

    const cart = await createCart(cartData);

    if (cart) {
      res.send({ cart });
    } else {
      next();
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET api/cart
router.get("/", async (req, res, next) => {
    try {
    const allCart = await getCart();
    const cart = allCart.filter((post) => {
      if (post.active) {
        return true;
      }
    });
    res.send(
      cart
    );
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// PATCH(UPDATE) api/cart
router.patch("/:cartId", requireUser, async (req, res, next) => {
  const { cartId } = req.params;
  const { user_id, isActive } = req.body;
  const updatedCart = {};

  if (user_id) {
    updatedCart.name = user_id;
  }
  if (price) {
    updatedCart.isActive = isActive;
  }

  try {
    const cart = await getCartById(cartId);

    if (cart.author.id === req.user.id) {
      const finalCart = await updateCart(cartId, updatedCart);
      res.send({ post: finalCart });
    } else {
      next({
        name: "UnauthorizedUser",
        message: "Cannot update a cart that is not yours.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// DELETE api/cart
router.delete("/:cartId", requireUser, async (req, res, next) => {
  try {
    const cart = await getCartById(req.params.cartId);

    if (cart && cart.author.id === req.user.id) {
      const deleteCart = await updateCart(cart.id, { active: false });
      res.send({ cart: deleteCart });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "Cannot delete a cart that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;