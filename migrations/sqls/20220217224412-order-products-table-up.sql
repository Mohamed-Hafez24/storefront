CREATE TABLE order_products (
    id SERIAL PRIMARY KEY NOT NULL,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);