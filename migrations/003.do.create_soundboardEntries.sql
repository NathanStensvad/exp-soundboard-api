CREATE TABLE "soundboardEntries" (
    soundboard_id INTEGER REFERENCES soundboards(id) ON DELETE CASCADE,
    file TEXT NOT NULL,
    activationKeysNumbers integer[]
);