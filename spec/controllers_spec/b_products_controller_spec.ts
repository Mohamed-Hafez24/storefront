import supertest from 'supertest';
import app from '../../src/app';
import { Product } from '../../src/types/product.type';

// test endpoint
const request = supertest(app);

const TOKEN: string = process.env.TEST_TOKEN ?? '';

describe('Test Products Controller Endpoints Response', () => {
    const product: Product = {
        name: 'laptop',
        price: 240,
        description: 'Good brand with high quality',
        category: 'electronics',
    };

    it('post    => /store/products   ==> expect create to create new product', async () => {
        const response = await request
            .post('/store/products')
            .set('authorization', 'Bearer ' + TOKEN)
            .send(product)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'laptop',
            price: 240,
            description: 'Good brand with high quality',
            category: 'electronics',
        });
    });

    it('get     => /store/products   ==> expect index to return all products', async () => {
        const response = await request.get('/store/products');
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('get     => /store/products?category=[categoryName]   ==> expect index to return products by category', async () => {
        const response = await request.get(
            '/store/products?category=electronics'
        );
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('put     => /store/products/1 ==> expect update to update the product by id', async () => {
        const newProduct = {
            id: 1,
            name: 'Gaming keyboard',
            price: 50,
            description: 'Good brand with high quality',
            category: 'electronics',
        };
        const response = await request
            .put('/store/products/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .send(newProduct)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);
        expect(response.body.name).toBe('Gaming keyboard');
        expect(response.body.id).toBe(1);
    });

    it('get     => /store/products/1 ==> expect show to return the product by id', async () => {
        const response = await request.get('/store/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Gaming keyboard',
            price: 50,
            description: 'Good brand with high quality',
            category: 'electronics',
        });
    });

    it('delete  => /store/products/1 ==> expect remove to delete the product by id', async () => {
        // create new product to test delete method and keep the first product for other tests
        await request
            .post('/store/products')
            .set('authorization', 'Bearer ' + TOKEN)
            .send(product)
            .expect(200);

        const res = await request
            .delete('/store/products/2')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(res.status).toBe(200);

        const response = await request.get('/store/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });
});
