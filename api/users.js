const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getUser,
  getUserByUserName,
  createUser,
  getUserById,
  updateUser,
  getAllUsers
} = require("../db/users");
const { requireUser, requireAdmin } = require("./utils");

//LOGIN
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "Missing Credentials Error",
      message: "Please give both a username and password",
    });
  }
  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({ user, token: token, message: "you're logged in!" });
    } else {
      next({
        name: "Incorrect Credentials Error",
        message: "Please give both a username and password",
      });
    }
  } catch (error) {

    next(error);
  }
});

//REGISTER
router.post("/register", async (req, res, next) => {
  const { username, password, name, location, email, isadmin } = req.body;

  try {
    const _user = await getUserByUserName(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length <= 6) {
      next({
        name: "You need more password",
        message: "Password Too Short!",
      });
    } else {
      const user = await createUser({
        username,
        password,
        name,
        location,
        email,
        isadmin
      });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        user,
        message: "thank you for signing up",
        token: token,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//ME
router.get("/me", requireUser, async (req, res, next) => {

  const username = req.user.username;

  try {
    const userInfo = await getUserByUserName(username);
    res.send(userInfo);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireUser, requireAdmin, async (req, res, next) => {
  try {
  const allUsers = await getAllUsers();
  res.send(allUsers)
  } catch (error) {
    console.error(error)
  }
})

//UPDATE USERS
router.patch("/:userId", requireUser, async (req, res, next) => {

  const { userId } = req.params;

  const { name, password, email, isadmin } = req.body;

  const updateUsers = {};

  if (name) {
    updateUsers.name = name;
  }
  if (password) {
    updateUsers.password = password;
  }
  if (email) {
    updateUsers.email = email;
  }
  if (isadmin) {
    updateUsers.isadmin = isadmin;
  }

  try {
    
    const users = await getUserById(userId);

    
    if (users.id == req.user.id) {

      const updatedUser = await updateUser(userId, updateUsers)

      res.send({ user: updatedUser})
    }
    else {
      next ({
        name:"UnauthorizedUser",
        message:"Cannot update this user profile."
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});




module.exports = router;
