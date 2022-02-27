import supertest from 'supertest';
import app from '../../src/app';

// test endpoint
const request = supertest(app);

const TOKEN: string = process.env.TEST_TOKEN ?? '';

describe('Test Cart Controller Endpoints Response', () => {
    it('post    => /store/cart/user/:userId/order/products   ==> expect addProduct to add a product to the user cart', async () => {
        const response = await request
            .post('/store/cart/user/1/order/products ')
            .set('authorization', 'Bearer ' + TOKEN)
            .send({ productId: '1', quantity: '3' })
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            id: 1,
            quantity: 3,
            order_id: '2',
            product_id: '1',
        });
    });
});
