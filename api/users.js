const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getUser,
  getUserByUserName,
  createUser,
  getUserById,
  updateUser
} = require("../db/users");
const { requireUser } = require("./utils");

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
    console.log(error);
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
  console.log("We made it")
  const username = req.user.username;

  try {
    const userInfo = await getUserByUserName(username);
    res.send(userInfo);
  } catch (err) {
    next(err);
  }
});

//UPDATE USERS
router.patch("/:userId", requireUser, async (req, res, next) => {
  // console.log("hello")
  const { userId } = req.params;
  // console.log(req.params, "this is req.params")
  const { name, password, email } = req.body;
  // console.log(req.body, "this is req.body")
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

  try {
    
    const users = await getUserById(userId);
    // console.log(users, "THIS is USERS")
    
    if (users.id == req.user.id) {
      // console.log("made it to if state")
      const updatedUser = await updateUser(userId, updateUsers)
      // console.log(updatedUser, "this is updateUser")
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
