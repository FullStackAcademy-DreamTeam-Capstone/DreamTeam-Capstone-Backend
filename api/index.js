const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {getUserById} = require("../db/users")


apiRouter.use(async (req, res, next) => {
  // console.log("We made it to apiRouter.use")
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        console.log(req.user)
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

const cartRouter = require('./cart');
apiRouter.use('/cart', cartRouter);

const cartItemRouter = require ("./cart_items");
apiRouter.use("/cart_items", cartItemRouter);

//Error Handler
apiRouter.use((error, req, res, next)=>{
  res.send({name: error.name, message: error. message, error: error.error})
})


module.exports = apiRouter;
