const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {getUserById} = require("../db/users")


apiRouter.use(async (req, res, next) => {
  console.log("We made it to apiRouter.use")
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  console.log(auth)
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    console.log(token, "this is token") 
    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
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



module.exports = apiRouter;
