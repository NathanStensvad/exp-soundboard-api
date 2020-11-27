const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')

const { makeUsersArray, makeSoundboardArray, makeSoundboardEntriesArray } = require('./soundboards.fixtures')

describe('Soundboards Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE TABLE soundboards RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => () => db.raw('TRUNCATE TABLE soundboards RESTART IDENTITY CASCADE'))

    describe(`GET /api/soundboards`, () => {
        context(`Given no soundboards`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/soundboards')
                    .expect(200, [])
            })
        })
    })

    //Login

    describe.only(`POST /api/login`, () => {
        context('Given there are users in the database', () => {
            const testUsers = makeUsersArray()

            beforeEach('insert users'), () => {
                return db
                    .into('users')
                    .insert(testUsers)
            }

            it(`responds with a user token`, function () {
                const login = {
                    name: "First Name",
                    password: "First Password"
                }
                return supertest(app)
                    .post('/api/users')
                    .send(login)
                    .expect(200)
            })
        })
        
    })

    //Get Soundboards

    describe(`GET api/soundboards/:soundboard_id`, () => {
        context('Given there are bookmarks in the database', () => {
            const testUsers = makeUsersArray()
            const testSoundboards = makeSoundboardArray()
            const testSoundboardEntries = makeSoundboardEntriesArray()

            beforeEach('insert users'), () => {
                return db
                    .into('users')
                    .insert(testUsers)
            }

            beforeEach('insert soundboards', () => {
                return db
                    .into('soundboards')
                    .insert(testSoundboards)
            })

            beforeEach('insert soundboardEntries', () => {
                return db
                    .into('soundboardEntries')
                    .insert(testSoundboardEntries)
            })

            it('responds with 200 and the specified soundboard', () => {
                const soundboardId = 2
                const expectedSoundboard = testSoundboard[soundboardId - 1]
                return supertest(app)
                    .get(`/api/soundboard/${soundboardId}`)
                    .expect(200, expectedSoundboard)
            })
        })
    })

    //Post

    describe(`POST api/soundboards`, () => {
        it(`creates a soundboard, responding with 201 and the new soundboard`, function () {
            this.retries(3)
            const newSoundboard = {
                name: "DELETEME",
                user_id: 1,
                public: false
            }
            return supertest(app)
                .post('/api/soundboards')
                .send(newSoundboard)
                .expect(201)
        })
    })

    //patch

    describe(`PATCH /api/soundboards/:id`, () => {
        context(`Given no soundboards`, () => {
            it(`responds with 404`, () => {
                const bookmarkId = 123456
                return supertest(app)
                .patch(`/api/soundboards/${bookmarkId}`)
                .expect(404, {error: {message: `Bookmark doesn't exist` } })
            })
        })
    })

    //Delete

    describe(`DELETE /api/soundboard/:id`, () => {
        context(`Given no soundboards`, () => {
            it(`responds with 404`, () => {
                const soundboardId = 123456
                return supertest(app)
                    .delete(`/api/bookmarks/${soundboardId}`)
                    .expect(404, { error: {message: `Soundboard doesn't exist` } })
            })
        })

        context('Given there are soundboards in the database', () => {
            const testUsers = makeUsersArray()
            const testSoundboards = makeSoundboardArray()
            const testSoundboardEntries = makeSoundboardEntriesArray()

            beforeEach('insert users'), () => {
                return db
                    .into('users')
                    .insert(testUsers)
            }

            beforeEach('insert soundboards', () => {
                return db
                    .into('soundboards')
                    .insert(testSoundboards)
            })

            beforeEach('insert soundboardEntries', () => {
                return db
                    .into('soundboardEntries')
                    .insert(testSoundboardEntries)
            })

            it('responds with 204 and removes the soundboard', () => {
                const idToRemove = 2
                const expectedSoundboards = testSoundboards.filter(soundboard => soundboard.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/bookmarks/${idToRemove}`)
                    .expect(204)
            })
        })
    })
})