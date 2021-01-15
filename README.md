# EXP Soundboard Manager(API)

This app is a manager for another program: EXP Soundboard. This app will allow users to make settings for soundboard and share their setup. 

## Live App

https://exp-soundboard-client.vercel.app

## Client Repo

https://github.com/NathanStensvad/exp-soundboard-client
To see how to use the client, go to the client's README

## API Documentation

api/soundboards

GET: Will return an array of soundboards with their entries

returns:

    "id": (integer),
    "name": (String),
    "user_id": (integer),
    "public": (boolean),
    "soundboardEntries": [
        {
            "file": (String),
            "activationKeysNumbers": [
                (integers)
            ]
        }
    ]

POST: Posts a new soundboard
required parameters: name(string), public(boolean)

returns:

    {
        "id": (integer),
        "name": (String),
        "user_id": (integer),
        "public": (boolean)
    }


api/soundboards/:id

GET: Returns a specific soundboard with their entries (see example for above soundboard in the general GET)

DELETE: Deletes a specific soundboard

PATCH: Updates a specific soundboard
required parameters: name(String), public(boolean), soundboardEntries(array of objects)

Example:

    "name": "Imperial Watch",
    "public": true,
    "soundboardEntries": [
        {
            "file": "C:\\Users\\TACO\\Documents\\EXP-Soundboards\\Imperial Watch\\For the empire.mp3",
            "activationKeysNumbers": [
                97
            ]
        },
        {
            "file": "C:\\Users\\TACO\\Documents\\EXP-Soundboards\\Imperial Watch\\Ive fought mudcrabs more fearsome than you.mp3",
            "activationKeysNumbers": [
                17, 96
            ]
        }
    ]


api/soundboards/:id/fork

POST: Makes a copy of a soundboard and posts it under the current user


api/users/:id/soundboards

GET: Gets all the soundboards from a certain user


## General Application Set up (Node setup)

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Seeding

psql -U nathan -d exp-soundboard -f ./seeds/seed.users.sql
psql -U nathan -d exp-soundboard -f ./seeds/seed.soundboards.sql
psql -U nathan -d exp-soundboard -f ./seeds/seed.soundboardEntries.sql

heroku run "psql $DATABASE_URL -f ./seeds/seed.users.sql"
INSERT INTO users (name, password) VALUES ('username', 'password')