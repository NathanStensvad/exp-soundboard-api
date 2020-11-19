CREATE TABLE soundboardentries (
    soundboard_id INTEGER REFERENCES soundboards(id) ON DELETE CASCADE,
    file TEXT NOT NULL,
    activationKeysNumbers integer[]
);