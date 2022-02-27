import client from '../database/postgres';
import { PoolClient, QueryResult } from 'pg';
import { User } from '../types/user.type';
import { encryptPass, decryptPass } from '../utilities/auth_password';

export class UserStore {
    table = 'users';

    // get user by id
    async getUserById(id: number): Promise<User> {
        try {
            const sql = `SELECT * FROM ${this.table} WHERE id=($1)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<User> = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to get User By Id ${id}: ${error}`);
        }
    }

    // get user by email
    async getUserByEmail(email: string): Promise<User> {
        try {
            const sql = `SELECT id,first_name, last_name,email, password_digest AS password, user_role FROM ${this.table} WHERE email=($1)`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<User> = await conn.query(sql, [email]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to get user by email ${email}: ${error}`);
        }
    }

    // create new user
    async create(u: User): Promise<User> {
        try {
            const user: User = await this.getUserByEmail(u.email);
            if (user) {
                throw new Error(`User already exist with email ${u.email}`);
            }
            const sql = `INSERT INTO ${this.table} (first_name, last_name, email, password_digest, user_role) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const hash: string = await encryptPass(u.password);
            const result: QueryResult<User> = await conn.query(sql, [
                u.first_name,
                u.last_name,
                u.email,
                hash,
                u.user_role,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `unable to create user (${u.first_name} ${u.last_name}): ${error}`
            );
        }
    }

    // update user
    async update(u: User): Promise<User> {
        try {
            if (!u.id) throw new Error(`somthing wrong with user id : ${u.id}`);
            const user: User = await this.getUserById(u.id);
            if (!user) throw new Error(`There is no user with id ${u.id}`);
            const sql = `UPDATE ${this.table} SET first_name=($2), last_name=($3), email=($4), password_digest=($5), user_role=($6) WHERE id=($1) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const hash: string = await encryptPass(u.password);
            const result: QueryResult<User> = await conn.query(sql, [
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                hash,
                u.user_role,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `unable to update user (${u.first_name} ${u.last_name}): ${error}`
            );
        }
    }

    // authenticate user to login by email and password
    async authenticate(email: string, password: string): Promise<User> {
        try {
            if (!email || !password)
                throw new Error(`Enter valid value for username and password`);
            const nullUser: User = {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                user_role: '',
            };
            const user: User = await this.getUserByEmail(email);
            if (user) {
                return (await decryptPass(password, user.password))
                    ? user
                    : nullUser;
            }
            throw new Error(`unable to get user with email ${email}`);
        } catch (error) {
            throw new Error(`Authentication Failed: ${error}`);
        }
    }

    /*
     * ——————————————————
     * /‾\/‾\/‾\/‾\/‾\/‾\
     * |---Only-Admin---|
     * \_/\_/\_/\_/\_/\_/
     * ——————————————————
     */

    // get all users
    async index(): Promise<User[]> {
        try {
            const sql = `SELECT * FROM ${this.table}`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<User> = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`unable to get users: ${error}`);
        }
    }

    // delete user by id
    async delete(id: number): Promise<User> {
        try {
            const user: User = await this.getUserById(id);
            if (!user) throw new Error(`There is no user with id ${id}`);
            const sql = `DELETE FROM ${this.table} WHERE id=($1) RETURNING *`;
            const conn: PoolClient = await client.connect();
            const result: QueryResult<User> = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to delete user (${id}): ${error}`);
        }
    }
}
