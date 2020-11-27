require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const soundboardsRouter = require('./soundboards/soundboards-router')
const UsersService = require('./users-service')
const AuthHelper = require('./AuthHelper')
const bodyParser = require('body-parser')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.post('/login', (req, res) => {
    console.log(req.body)
    const { name, password } = req.body;

    if (!name || !password)
        return res.status(400).json(
            { error: "body must contain name and password" }
        );

    UsersService.getByUsername(req.app.get('db'), name).then(
        (user) => {
            if (!user[0])
                return res.status(401).json({ error: "Invalid username or password" });
            if(user[0].password !== password)
                return res.status(401).json({ error: "Invalid username or password" });

            return res.json({
                user: {
                    id: user[0].id,
                    name: user[0].name
                },
                token: AuthHelper.generateToken(user[0])
            });
        });
});

app.use(soundboardsRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app