const express = require("express");
const router = express.Router();
const { getCart, getCart } = require("../db/cart");
const { requireUser } = require('./utils')

// POST api/cart

// GET api/cart
router.get("/", async (req,res,next) =>{
    const getCart = await getCart();
    res.send(getCart);
});
// PATCH api/cart

// DELETE api/cart