import { PoolClient, QueryResult } from 'pg';
import client from '../database/postgres';
import { OrderStore } from '../models/order';
import { ProductStore } from '../models/product';
import { CartReturn } from '../types/cart.type';
import { Order } from '../types/order.type';
import { Product } from '../types/product.type';

// get instance of order store
const orderStore: OrderStore = new OrderStore();
// get instance of product store
const productStore: ProductStore = new ProductStore();

export class Cart {
    async addProduct(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<CartReturn> {
        try {
            const product: Product = await productStore.show(productId);
            if (!product)
                throw new Error('You are tryig to add non existing product');

            let order: Order = await orderStore.getUserActiveOrder(userId);
            // check if there is no active order then create an active order then add the products to it
            if (!order) {
                const newOrder: Order = {
                    user_id: userId,
                    status: 'active',
                };
                order = await orderStore.create(newOrder);
            }

            // add product to the active order
            const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult = await conn.query(sql, [
                order.id,
                productId,
                quantity,
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Could not add product ${productId} to cart : ${err}`
            );
        }
    }
}
