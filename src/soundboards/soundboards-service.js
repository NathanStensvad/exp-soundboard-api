const { KnexTimeoutError } = require("knex")

function convertToJs(results) {
    const soundBoards = [];
    const added = new Set(); // .add() .remove() .has()

    for (const line of results) {
        if (!added.has(line.id)) {
            const soundBoard = {
                id: line.id,
                name: line.name,
                user_id: line.user_id,
                public: line.public,
                soundboardentries: []
            };

            soundBoards.push(soundBoard);
            added.add(line.id);
        }
    }

    for (const line of results) {
        const soundBoardEntry = {
            file: line.file,
            activationKeysNumbers: line.activationkeysnumbers
        };
        const soundboard = soundBoards.find(s => s.id === line.soundboard_id)
        if (soundboard) {
            soundboard.soundboardentries
                .push(soundBoardEntry);
        }
    }

    return soundBoards;
}

function _soundboardsWithEntries(knex) {
    return knex.select('*').from('soundboards')
        .leftJoin('soundboardentries', 'soundboardentries.soundboard_id', 'soundboards.id')
}

const SoundboardsService = {
    getAllSoundboards(knex) {
        return _soundboardsWithEntries(knex).where('public', true)
            .then(convertToJs)
    },
    getUserSoundboards(knex, user_id) {
        return _soundboardsWithEntries(knex).where('user_id', user_id)
            .then(convertToJs)
    },
    getById(knex, id) {
        return _soundboardsWithEntries(knex).where('id', id).then(
            results => convertToJs(results)[0]
        )
    },
    insertSoundboard(knex, newSoundboard) {
        return knex
            .insert(newSoundboard)
            .into('soundboards')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateSoundboard(knex, id, newSoundboardFields) {
        return knex('soundboards')
            .where({ id })
            .update(newSoundboardFields)
    },
    deleteSoundboard(knex, id) {
        return knex('soundboards')
            .where({ id })
            .delete()
            .then(() => this.deleteEntries(knex,id))
    },
    deleteEntries(knex, soundboard_id) {
        return knex('soundboardentries').where('soundboard_id', soundboard_id).del()
    },
    updateEntries(knex, soundboard_id, newEntries) { // newEntries = [{file, activationKeysNumbers}]
        const entries = newEntries.map((entry) => ({ ...entry, soundboard_id }));

        return this.deleteEntries(knex, soundboard_id).then(
            () => knex('soundboardentries').insert(entries)
        );
    }
}

module.exports = SoundboardsService