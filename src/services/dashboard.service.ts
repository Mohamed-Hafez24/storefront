import Client from '../database/postgres';
import {
    PopularProducts,
    UsersWithOrders,
    ProductsInOrders,
} from '../types/dashboard.type';

export class DashboardQueries {
    // Get Top 5 most popular products based on amount of sales for each product
    async fiveMostPopularProducts(): Promise<PopularProducts[]> {
        try {
            const sql = `
                    SELECT name,  sum(quantity) AS total_quantity , COUNT(DISTINCT order_id) AS number_of_orders
                    FROM products 
                    INNER JOIN order_products 
                        ON products.id = order_products.product_id
                    INNER JOIN orders 
                        ON orders.id = order_products.order_id
                    WHERE orders.status = 'complete'
                    GROUP BY ( name)
                    ORDER BY total_quantity DESC LIMIT 5;
                `;
            const conn = await Client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable get top 5 most popular products: ${err}`);
        }
    }

    // Get all users that have made orders and the number of orders for each user
    async usersWithOrders(): Promise<UsersWithOrders[]> {
        try {
            const sql = `  
                    SELECT users.first_name, users.last_name, COUNT(orders.user_id) AS orders_mount 
                    FROM users INNER JOIN orders ON users.id = orders.user_id 
                    WHERE orders.status = 'complete'
                    GROUP BY users.first_name , users.last_name ;
                `;
            const conn = await Client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable get users with orders: ${err}`);
        }
    }

    // Get all products that have been included in orders
    async productsInOrders(): Promise<ProductsInOrders[]> {
        try {
            const sql = `   
                SELECT  name, price, category, sum(quantity) AS total_quantity, order_id 
                FROM products 
                INNER JOIN order_products 
                    ON products.id = order_products.product_id
                INNER JOIN orders
                    ON orders.id = order_products.order_id
                WHERE orders.status = 'complete'
                GROUP BY products.id, products.name, order_id ;
            `;
            const conn = await Client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }
}
