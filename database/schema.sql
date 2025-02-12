DROP TABLE IF EXISTS users, cards;

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    testNumber INT,
    question VARCHAR(200),
    answer VARCHAR(200)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    test INT
);