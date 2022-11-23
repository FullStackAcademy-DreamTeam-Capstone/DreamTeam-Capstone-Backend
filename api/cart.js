const express = require("express");
const router = express.Router();
const { 
    getCart } = require("../db/cart");
const { requireUser } = require('./utils')

// POST api/cart

// GET api/cart
router.get("/", async (req,res,next) =>{
    try {
        const getAllCart = await getCart();
        res.send(getAllCart);
    } catch ({name, message}) {
        next({name, message})
    }
    
});
// PATCH api/cart

// DELETE api/cart