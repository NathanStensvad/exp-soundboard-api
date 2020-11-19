const path = require('path')
const express = require('express')
const UsersService = require('./users-service')
const SoundboardsService = require('../soundboards/soundboards-service')

const UsersRouter = express.Router()
const jsonParser = express.json()

const soundboardGenerator = soundboard => ({
    ...soundboard,
})

UsersRouter
    .route('/api/users/:id/soundboards')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User doesn't exist` }
                    })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        SoundboardsService.getUserSoundboards(req.app.get('db'), res.user.id).then(
            (soundboards) => res.json(soundboards)
        )
        .catch(next)
    })

module.exports = UsersRouter