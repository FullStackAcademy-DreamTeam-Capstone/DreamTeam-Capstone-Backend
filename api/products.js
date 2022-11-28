const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {jwt} = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getAllProduct,
  createProduct,
  updateProduct,
  getProductById,
} = require("../db/products");

//MAKING SURE A REQUEST ID BEING MADE TO /products
router.use((req, res, next) => {
  console.log("we made it to the products api")
  next();
});

// CREATE PRODUCT
// NEED TO ADD "REQUIRE USER", IT WORKS WITHOUT AND I AM NOT SURE IF WE CAN DO SOMETHING ELSE TO VERIFY THE LOGIN
router.post("/", async (req, res, next) => {
  console.log("we are making it to the api /products");
  const { name, price } = req.body;
  
  try {
  
    const product = await createProduct({name, price});
    console.log(product, "this is product")
    if (product) {
      res.send({ product });
    } else {
      next();
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
  console.log( "we made it to the api call"); 
});

// GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProduct();
    const products = allProducts.filter((post) => {
      if (post.active) {
        return true;
      }
    });
    res.send({
      products,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// UPDATING A PRODUCT
// TOOK OUT requireUser, "ask for help"
router.patch("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const { name, price } = req.body;
  const updateProduct = {};

  if (name) {
    updateProduct.name = name;
  }
  if (price) {
    updateProduct.price = price;
  }

  try {
    const product = await getProductById(productId);

    if (product.author.id === req.user.id) {
      const updatedProduct = await updateProduct(productId, updateProduct);
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
router.delete("/:productId",  async (req, res, next) => {
  try {
    const product = await getProductById(req.params.productId);
    if (product && product.author.id === req.user.id) {
      const deleteProduct = await updateProduct(product.id, { active: false });

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
