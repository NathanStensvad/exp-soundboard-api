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
            activationkeysnumbers: [
                18,
                99
            ]
        },
        {
            soundboard_id: 1,
            file: "First Entry Two",
            activationkeysnumbers: [
                23
            ]
        },
        {
            soundboard_id: 1,
            file: "First Entry Three",
            activationkeysnumbers: [
                53, 42
            ]
        },
        {
            soundboard_id: 2,
            file: "Second Entry One",
            activationkeysnumbers: [
                17,
                18,
                107
            ]
        },
        {
            soundboard_id: 3,
            file: "Third Entry One",
            activationkeysnumbers: [
                4646, 981
            ]
        },
        {
            soundboard_id: 3,
            file: "Third Entry Two",
            activationkeysnumbers: [
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