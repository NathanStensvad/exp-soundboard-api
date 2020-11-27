function makeUsersArray() {
    return [
        {
            id: 1,
            name: "First Name",
            password: "First Password"
        },
        {
            id: 2,
            name: "Second Name",
            password: "Second Password"
        }
    ]
}
function makeSoundboardArray() {
    return [
        {
            id: 1,
            name: "First Soundboard",
            user_id: 1,
            public: true,
        },
        {
            id: 2,
            name: "Second Soundboard",
            user_id: 2,
            public: true,
        },
        {
            id: 3,
            name: "Third Soundboard",
            user_id: 1,
            public: false,
        }
    ]
}

function makeSoundboardEntriesArray() {
    return [
        {
            soundboard_id: 1,
            file: "First Entry One",
            activationKeysNumbers: [
                18,
                99
            ]
        },
        {
            soundboard_id: 1,
            file: "First Entry Two",
            activationKeysNumbers: [
                23
            ]
        },
        {
            soundboard_id: 1,
            file: "First Entry Three",
            activationKeysNumbers: [
                53, 42
            ]
        },
        {
            soundboard_id: 2,
            file: "Second Entry One",
            activationKeysNumbers: [
                17,
                18,
                107
            ]
        },
        {
            soundboard_id: 3,
            file: "Third Entry One",
            activationKeysNumbers: [
                4646, 981
            ]
        },
        {
            soundboard_id: 3,
            file: "Third Entry Two",
            activationKeysNumbers: [
                9000
            ]
        }
    ]

}

module.exports = {
    makeUsersArray,
    makeSoundboardArray,
    makeSoundboardEntriesArray
}