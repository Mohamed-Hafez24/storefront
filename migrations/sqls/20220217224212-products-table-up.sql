CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    price integer NOT NULL,
    description text,
    category VARCHAR(64)
);