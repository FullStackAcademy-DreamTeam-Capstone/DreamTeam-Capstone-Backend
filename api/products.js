const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { jwt } = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getAllProduct,
  createProduct,
  updateProduct,
  getProductById,
} = require("../db/products");

//MAKING SURE A REQUEST ID BEING MADE TO /products
router.use((req, res, next) => {

  next();
});

// CREATE PRODUCT
router.post("/", requireUser, requireAdmin, async (req, res, next) => {

  const { name, price, img_url } = req.body;

  try {
    const product = await createProduct({ name, price, img_url });

    if (product) {
      res.send({ product });
    } else {
      next();
    }
  } catch ({ name, message }) {
    next({ name, message });
  }

});

// GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  try {
    const allActiveProducts = await getAllProduct();
  
    res.send({
      allActiveProducts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// UPDATING A PRODUCT
router.patch("/:productId", requireUser, requireAdmin, async (req, res, next) => {
  const { productId } = req.params;

  const { name, price } = req.body;

  const newProduct = {};

  if (name) {
    newProduct.name = name;
  }
  if (price) {
    newProduct.price = price;
  }

  try {
    const product = await getProductById(productId);

    if (product.id == productId) {
      const updatedProduct = await updateProduct(productId, newProduct);

      res.send({ post: updatedProduct });
    } else {
      next({
        name: "UnauthorizedUser",
        message: "Cannot update a product that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE A PRODUCT
// TOOK OUT requireUser, "ask for help"
router.delete("/:productId", requireUser, requireAdmin, async (req, res, next) => {

  const { productId } = req.params;


  try {
    const product = await getProductById(req.params.productId);

    if (productId) {

      const deleteProduct = await updateProduct(product.id, {active: false} );

      res.send(deleteProduct);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "cannot delete a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
