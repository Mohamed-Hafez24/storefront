import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_TEST_DB,
    ENV,
} = process.env;

console.log('You are in ' + ENV + ' Mode');

const client: Pool = new Pool({
    host: POSTGRES_HOST,
    database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
});

export default client;
