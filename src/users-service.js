const { getById } = require("./soundboards/soundboards-service")

const UsersService = {
    getByUsername(knex, name) {
        return knex.select('*').from('users').where('name', name)
    },
    getById(knex, id) {
        return knex.select('*').from('users').where('id', id).first()
    }
}



module.exports = UsersService