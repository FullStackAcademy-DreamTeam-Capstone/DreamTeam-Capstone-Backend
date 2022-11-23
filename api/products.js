const express = require("express");
const productRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  getProductById,
} = require("./products");

// CREATE PRODUCT
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

// GET ALL PRODUCTS 
productRouter.get("/", async (req, res, next) => {
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
productRouter.patch("/:productId", requireUser, async (req, res, next) => {
  const { productId } = req.params;
  const { name, price } = req.body;
  const updateProduct = {};

  if (name) {
    updatedProduct.name = name;
  }
  if (price) {
    updatedProduct.price = price;
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
productRouter.delete('/:productId', requireUser, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.productId)
    if(product && product.author.id === req.user.id) {
      const deleteProduct = await updateProduct(product.id, {active: false});

      res.send({product: deleteProduct})
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "cannot delete a post that is not yours"
      })
    }
    
  } catch ({name, message}) {
    next({name, message})
  }
})