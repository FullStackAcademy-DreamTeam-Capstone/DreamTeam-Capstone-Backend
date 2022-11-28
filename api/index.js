const express = require("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");

const { JWT_secret } = process.env;

apiRouter.use(async (req, res, next) => {
  console.log('anything')
  const prefix = "Bearer";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_secret);

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

module.exports = apiRouter;
