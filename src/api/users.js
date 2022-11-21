const express = require("express");

// router.post("/login" async (req,res,next) => {
//     const {username, password } = req.body
//     if (!username || !password) {
//         next ({
//             name:"Missing Credentials Error",
//             message:"Please give both a username and password"

//         });
//     } else {
//         try {
//             const user = await getUserInfo({username, password})

//             if (user) {
//                 const token = jwt.sign(
//                     {
//                         id: user.id,
//                         username,
//                       },
//                       JWT_SECRET,
//                       {
//                         expiresIn: "1w",
//                       }
//                 )
//                 res.send({ user, token, message: "you're logged in!" });
//             } else {
//                 next ({
//                     name:"Incorrect Credentials Error",
//                      message:"Please give both a username and password"
//                 })
//             }

//         } catch (error) {
//             console.log(error);
//             next(error);
//           }
//     }
// })
