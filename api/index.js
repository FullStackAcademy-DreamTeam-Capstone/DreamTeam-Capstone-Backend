const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');

const {JWT_secret} = process.env;

apiRouter.use( async, (req, res, next) => {
    const prefix = 'Bearer';
    const auth = req.header('Authorization')
    if (!auth) {
        next()
    }
    else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try {

        } catch ({name, message}) {
            next({name, message})
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        })
    }
})
module.exports = apiRouter;