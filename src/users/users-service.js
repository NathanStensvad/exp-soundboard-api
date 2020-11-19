const { KnexTimeoutError } = require("knex")


const usersService = {
    getById(knex, id) {
        return knex('users').where({ id }).first()
    }
}

module.exports = usersService