CREATE TABLE users (
    id SERIAL PRIMARY  KEY NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR NOT NULL ,
    password_digest VARCHAR NOT NULL,
    user_role VARCHAR(100) NOT NULL
);