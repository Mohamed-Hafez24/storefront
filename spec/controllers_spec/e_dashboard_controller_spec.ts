import supertest from 'supertest';
import app from '../../src/app';

// test endpoint
const request = supertest(app);

const TOKEN: string = process.env.TEST_TOKEN ?? '';

describe('Test Dashboard Controller Endpoints Response', () => {
    it('get    => /store/dashboard/five-top-popular-products   ==> expect fiveMostPopularProducts to return top five popular products', async () => {
        const response = await request
            .get('/store/dashboard/five-top-popular-products ')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).not.toBeGreaterThan(0);
    });

    it('get    => /store/dashboard/users-with-orders   ==> expect usersWithOrders to return users that made orders and their orders count', async () => {
        const response = await request
            .get('/store/dashboard/users-with-orders ')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).not.toBeGreaterThan(0);
    });

    it('get    => /store/dashboard/products-in-orders  ==> expect productsInOrders to return products that included in orders', async () => {
        const response = await request
            .get('/store/dashboard/products-in-orders ')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).not.toBeGreaterThan(0);
    });
});
