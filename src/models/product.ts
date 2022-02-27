import { PoolClient, QueryResult } from 'pg';
import client from '../database/postgres';
import { Product } from '../types/product.type';

export class ProductStore {
    // database table name
    table = 'products';

    // get all products
    async index(): Promise<Product[]> {
        try {
            const sql = `SELECT * FROM ${this.table}`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Product> = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get products ${error}`);
        }
    }

    // get products by category
    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE category=($1)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Product> = await conn.query(sql, [
                category,
            ]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get products by category ${error}`);
        }
    }

    // get product by id
    async show(id: string): Promise<Product> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE id=($1)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Product> = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to show product ${id}: ${error}`);
        }
    }

    /*
     * ——————————————————
     * /‾\/‾\/‾\/‾\/‾\/‾\
     * |---Only-Admin---|
     * \_/\_/\_/\_/\_/\_/
     * ——————————————————
     */

    // create new product
    async create(p: Product): Promise<Product> {
        try {
            const sql = `INSERT INTO ${this.table} (name, price, description, category) VALUES($1, $2, $3, $4) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Product> = await conn.query(sql, [
                p.name,
                p.price,
                p.description,
                p.category,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to create product (${p.name}): ${error}`);
        }
    }

    // update product
    async update(p: Product): Promise<Product> {
        try {
            const sql = `UPDATE products SET name=$2, price=$3, description=$4, category=$5 WHERE id=$1 RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Product> = await conn.query(sql, [
                p.id,
                p.name.trim(),
                p.price,
                p.description,
                p.category?.trim(),
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to update product (${p.name}): ${error}`);
        }
    }

    // delete product by id
    async delete(id: string): Promise<Product> {
        try {
            const sql = `DELETE FROM ${this.table} WHERE id=($1) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<Product> = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to delete product (${id}): ${error}`);
        }
    }
}
