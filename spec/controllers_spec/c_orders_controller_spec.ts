import supertest from 'supertest';
import app from '../../src/app';
import { Order } from '../../src/types/order.type';

// test endpoint
const request = supertest(app);

const TOKEN: string = process.env.TEST_TOKEN ?? '';

describe('Test Orders Controller Endpoints Response', () => {
    const order: Order = { user_id: '1', status: 'active' };

    it('post    => /store/orders/user/:userId   ==> expect create to create new order', async () => {
        const response = await request
            .post('/store/orders/user/1 ')
            .set('authorization', 'Bearer ' + TOKEN)
            .send(order)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            id: 1,
            user_id: '1',
            status: 'active',
        });
    });

    it('get    => /store/orders/:orderId/user/:userId   ==> expect getUserOrderById to return user order by id', async () => {
        const response = await request
            .get('/store/orders/1/user/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            id: 1,
            user_id: '1',
            status: 'active',
        });
    });

    it('get    => /store/orders/active/user/:userId   ==> expect getUserActiveOrder to return user Active order', async () => {
        const response = await request
            .get('/store/orders/active/user/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            id: 1,
            user_id: '1',
            status: 'active',
        });
    });

    it('get    => /store/orders/current/user/:userId   ==> expect getUserCurrentOrder to return user current order', async () => {
        const response = await request
            .get('/store/orders/current/user/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            id: 1,
            user_id: '1',
            status: 'active',
        });
    });

    it('get    => /store/orders/processed/user/:userId   ==> expect getUserProcessedOrders to return user processed orders', async () => {
        const response = await request
            .get('/store/orders/processed/user/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.body).toThrowError;
    });

    it('get    => /store/orders/user/:userId   ==> expect getUserOrders to return user all orders', async () => {
        const response = await request
            .get('/store/orders/user/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('get     => /store/orders   ==> expect index to return all orders for all users', async () => {
        const response = await request
            .get('/store/orders')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('put     => /store/orders/:orderId ==> expect update to update the order by id', async () => {
        const updatedOrder = { status: 'complete' };
        const response = await request
            .put('/store/orders/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .send(updatedOrder)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);
        expect(response.body.status).toBe('complete');
        expect(response.body.id).toBe(1);
    });

    it('get    => /store/orders/completed/user/:userId   ==> expect getUserCompletedOrders to return user completed orders', async () => {
        const response = await request
            .get('/store/orders/completed/user/1')
            .set('authorization', 'Bearer ' + TOKEN)
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, user_id: '1', status: 'complete' },
        ]);
    });

    it('delete  => /store/orders/:orderId ==> expect remove to delete the order by id', async () => {
        const res = await request
            .delete('/store/orders/1')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(res.status).toBe(200);

        const response = await request
            .get('/store/orders')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });
});
