const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const { jwt } = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getAllProduct,
  createProduct,
  updateProduct,
  getProductById,
  getAllActiveProducts
} = require("../db/products");

//MAKING SURE A REQUEST ID BEING MADE TO /products
router.use((req, res, next) => {
  console.log("we made it to the products api");
  next();
});

// CREATE PRODUCT
router.post("/", requireUser, async (req, res, next) => {
  console.log("we are making it to router.post for create product");
  const { name, price } = req.body;

  try {
    const product = await createProduct({ name, price });
    console.log(product, "this is product");
    if (product) {
      res.send({ product });
    } else {
      next();
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
  console.log("we finished creating the product");
});

// GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  try {
    const allActiveProducts = await getAllActiveProducts();
  
    res.send({
      allActiveProducts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// UPDATING A PRODUCT
router.patch("/:productId", requireUser, async (req, res, next) => {
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
router.delete("/:productId", requireUser, async (req, res, next) => {
  console.log("made it to router.delete")
  const { productId } = req.params;
  console.log(req.params, "this is req.params")

  try {
    const product = await getProductById(req.params.productId);
    console.log(product, "this is the product")
    if ( product.id == productId) {
      console.log("we made it to the if")
      const deleteProduct = await updateProduct(product.id, {active: false} );
      console.log(deleteProduct, "this is the deleted product")
      res.send({ product: deleteProduct });
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
