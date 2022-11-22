const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');

const {JWT_secret} = process.env;


module.exports = apiRouter;