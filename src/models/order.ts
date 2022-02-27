import { PoolClient, QueryResult } from 'pg';
import client from '../database/postgres';
import { Order } from '../types/order.type';

export class OrderStore {
    table = 'orders';

    // get orders for specific user using userId
    async getUserOrders(userId: string): Promise<Order[]> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE user_id=($1)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`unable to get user orders: ${error}`);
        }
    }

    // get specific order for specific user using orderId and userId
    async getUserOrderById(orderId: string, userId: string): Promise<Order> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE id=($1) AND  user_id=($2)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [
                orderId,
                userId,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to show order ${orderId}: ${error}`);
        }
    }

    // get current order for specific user using userId
    async getUserCurrentOrder(userId: string): Promise<Order> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE user_id=($1) ORDER BY id DESC LIMIT 1`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [userId]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `unable to show current order for user ${userId}: ${error}`
            );
        }
    }

    // get active order for specific user using userId
    async getUserActiveOrder(userId: string): Promise<Order> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE user_id=($1) AND status='active'`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [userId]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `unable to show active orders for user ${userId}: ${error}`
            );
        }
    }

    // get processed orders for specific user using userId
    async getUserProcessedOrders(userId: string): Promise<Order[]> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE user_id=($1) AND status='processing'`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `unable to show processed orders for user ${userId}: ${error}`
            );
        }
    }

    // get completed orders for specific user using userId
    async getUserCompletedOrders(userId: string): Promise<Order[]> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE user_id=($1) AND status='complete'`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `unable to show complete orders for user ${userId}: ${error}`
            );
        }
    }

    // create new order for specific user using userId
    async create(o: Order): Promise<Order> {
        try {
            const activeOrder = await this.getUserActiveOrder(o.user_id);
            // check if you have an active order already
            if (activeOrder)
                throw new Error(
                    `You have an active order already. to create new order change order ${activeOrder.id} status to 'complete' or 'processing' to be able for creating new order`
                );
            const sql = `INSERT INTO ${this.table} (status, user_id) VALUES($1, $2) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [
                o.status,
                o.user_id,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `unable to create order for user (${o.user_id}): ${error}`
            );
        }
    }

    /*
     * ——————————————————
     * /‾\/‾\/‾\/‾\/‾\/‾\
     * |---Only-Admin---|
     * \_/\_/\_/\_/\_/\_/
     * ——————————————————
     */

    // get all orders data
    async index(): Promise<Order[]> {
        try {
            const sql = `SELECT * FROM ${this.table}`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`unable to get orders: ${error}`);
        }
    }

    // get order by orderId
    async show(orderId: string): Promise<Order> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE id=($1)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to show order ${orderId}: ${error}`);
        }
    }

    // update order status by orderId
    async updateOrderStatus(id: string, status: string): Promise<Order> {
        try {
            // check if order exist or not
            const order: Order = await this.show(id);
            if (!order) throw new Error(`Could not find order with id ${id}`);

            const sql = `UPDATE ${this.table} SET status=($2) WHERE id=($1) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [
                id,
                status,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to update order ${id} status : ${error}`);
        }
    }

    // Delete order by orderId
    async delete(id: string): Promise<Order> {
        try {
            // check if order exist or not
            const order: Order = await this.show(id);
            if (!order) throw new Error(`Could not find order with id ${id}`);
            const sql = `DELETE FROM ${this.table} WHERE id=($1) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Order> = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to delete order ${id}: ${error}`);
        }
    }
}
