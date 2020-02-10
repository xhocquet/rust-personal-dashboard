-- Your SQL goes here

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  finished BOOLEAN NOT NULL DEFAULT false
);
