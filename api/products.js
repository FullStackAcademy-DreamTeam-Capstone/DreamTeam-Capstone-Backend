const express = require("express");
const productRouter = express.Router();
const { requireUser } = require("./utils");
const { getAllProduct, createProduct, updateProduct } = require("./products");

// CREATE POST
productRouter.post("/", requireUser, async (req, res, next) => {
  const { name, price } = req.body;
  const productData = {};

  try {
    productData.authorId = req.user.id;
    productData.name = name;
    productData.price = price;

    const product = await createProduct(productData);

    if (product) {
      res.send({ product });
    } else {
      next();
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET ALL POSTS
productRouter.get('/', async (req, res, next) => {
try {
    const allProducts = await getAllProduct();

} catch ({name, message}) {
    next({name, message})
}   
})
