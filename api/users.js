const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
    getUser,
    getUserByUserName,
    createUser
} = require("../db/users");
const { requireUser } = require('./utils')

//LOGIN
router.post("/login", async (req,res,next) => {
    const {username, password } = req.body
    if (!username || !password) {
        next ({
            name:"Missing Credentials Error",
            message:"Please give both a username and password"

        });
    } else {
        try {
            const user = await getUser({username, password})

            if (user) {
                const token = jwt.sign(
                    {
                        id: user.id,
                        username,
                      },
                      JWT_SECRET,
                      {
                        expiresIn: "1w",
                      }
                )
                res.send({ user, token, message: "you're logged in!" });
            } else {
                next ({
                    name:"Incorrect Credentials Error",
                     message:"Please give both a username and password"
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
          }
    }
})

//REGISTER
router.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUserName(username);
      if (_user) {
        next({
          name: "UserExistsError",
          message: `User ${username} is already taken.`,
        });
      }
        else if (password.length <= 8) {
            next({
                name: "You need more password",
                message: "Password Too Short!"
            })
        }
        else{
      const user = await createUser({
        username,
        password,
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
        message: "thank you for signing up",
        token: token,
        user:{ id:user.id , username:user.username}
      });
    }
    } catch (err) {
      next(err);
    }
  });

  //ME
  router.get("/me", requireUser, async (req, res, next) => {

    const username = req.user.username
    
      try {
  
          const userInfo = await getUserByUsername(username);
          res.send(userInfo) 
      }
      catch (err) {
        next(err);
      }
  });