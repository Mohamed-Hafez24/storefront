CREATE TABLE orders (
    id SERIAL PRIMARY KEY NOT NULL,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
);