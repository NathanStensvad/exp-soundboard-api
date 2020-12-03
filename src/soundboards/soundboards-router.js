const path = require('path')
const express = require('express')
const SoundboardsService = require('./soundboards-service')
const AuthHelper = require('../AuthHelper')

const SoundboardsRouter = express.Router()
const jsonParser = express.json()

const soundboardGenerator = soundboard => ({
    ...soundboard,
    name: soundboard.name,
})

SoundboardsRouter
    .route('/api/soundboards')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        SoundboardsService.getAllSoundboards(knexInstance)
            .then(soundboard => {
                res.json(soundboard.map(soundboardGenerator))
            })
            .catch(next)
    })
    .post(jsonParser, AuthHelper.requireAuth, (req, res) => {
        const { name, public } = req.body;
        const user_id = res.user.id;
        console.log(res.user)
        const newSoundboard = { name, user_id, public }

        for (const [key, value] of Object.entries(newSoundboard)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        SoundboardsService.insertSoundboard(
            req.app.get('db'),
            newSoundboard
        )
            .then(soundboard => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${soundboard.id}`))
                    .json(soundboardGenerator(soundboard))
            })
    })

SoundboardsRouter
    .route('/api/soundboards/:id')
    .all((req, res, next) => {
        SoundboardsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(soundboard => {
                if (!soundboard) {
                    return res.status(404).json({
                        error: { message: `Soundboard doesn't exist` }
                    })
                }
                res.soundboard = soundboard
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(soundboardGenerator(res.soundboard))
    })
    .delete(AuthHelper.requireAuth, (req, res, next) => {
        SoundboardsService.deleteSoundboard(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, AuthHelper.requireAuth, (req, res, next) => {
        const { name, user_id, public, soundboardEntries } = req.body
        const soundboardToUpdate = { name, user_id, public }

        if (soundboardEntries) {
            for (const e of soundboardEntries) {
                if (!('activationKeysNumbers' in e) || !('file' in e))
                    return res.status(400).json({
                        error: {
                            message: "All soundboard entries must have 'file' and 'activationKeysNumbers'"
                        }
                    })
            }
        }

        const entries = soundboardEntries && soundboardEntries.map((e) => ({ file: e.file, activationkeysnumbers: e.activationKeysNumbers }))
        const numberOfValues = Object.values(soundboardToUpdate).filter(Boolean).length

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name', 'user_id', 'public'`
                }
            })
        }

        SoundboardsService.updateSoundboard(
            req.app.get('db'),
            req.params.id,
            soundboardToUpdate
        )
            .then(() => entries ?
                SoundboardsService.updateEntries(req.app.get('db'), req.params.id, entries) : 0)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)

        //.then(() => SoundboardService.updateEntries(knex, soundboard_id, req.body.soundboardEntrises))
    })

SoundboardsRouter
    .post('/api/soundboards/:id/fork', AuthHelper.requireAuth,
        async (req, res, next) => {
            const db = req.app.get('db');
            const soundboard = await SoundboardsService.getById(db, req.params.id);
            const newSoundboard = {
                name: soundboard.name + ' (copy)',
                user_id: res.user.id
            };

            
            const dbSoundboard = await SoundboardsService.insertSoundboard(db, newSoundboard);
            await SoundboardsService.updateEntries(db, dbSoundboard.id, soundboard.soundboardEntries.map(({ file, activationKeysNumbers}) => ({ file, activationkeysnumbers: activationKeysNumbers})));

            return res.end();
        });

SoundboardsRouter
    .route('/api/users/:id/soundboards')
    .all((req, res, next) => {
        SoundboardsService.getByUserId(
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

module.exports = SoundboardsRouter