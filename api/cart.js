const express = require("express");
const router = express.Router();
const {
  getCart,
  createCart,
  getCartById,
  updateCart,
} = require("../db/cart");
const { requireUser } = require("./utils");

router.use((req, res, next) => {
  console.log("PULLING FROM CART API");
  next();
});

// POST(CREATE CART) api/cart
router.post("/", async (req, res, next) => {
  console.log("CURRENTLY POST CART")
  const { user_id } = req.body;
  console.log(req.body)
  try {
    const cart = await createCart(user_id);
    console.log("cart 26")
    if (cart) {
      res.send({ cart });
    } else {
      next();
    }
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
  console.log("finished cart POST")
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
        error: "number",
        name: "UnauthorizedUserError",
        message: "Cart is not yours; cannot update.",
      });
    }
  } catch ({ error, name, message }) {
    next({ error, name, message });
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
        error: "number",
        name: "UnauthorizedUserError",
        message: "Cart is not yours; cannot delete.",
      });
    }
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
});

module.exports = router;