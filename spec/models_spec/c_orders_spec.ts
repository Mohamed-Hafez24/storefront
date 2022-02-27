import { OrderStore } from '../../src/models/order';
import { Order } from '../../src/types/order.type';

const store = new OrderStore();

describe('Order Model', () => {
    const order: Order = { status: 'active', user_id: '1' };

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a getUserCurrentOrder method', () => {
        expect(store.getUserCurrentOrder).toBeDefined();
    });

    it('should have a getUserActiveOrder method', () => {
        expect(store.getUserActiveOrder).toBeDefined();
    });

    it('should have a getUserProcessedOrders method', () => {
        expect(store.getUserProcessedOrders).toBeDefined();
    });

    it('should have a getUserCompletedOrders method', () => {
        expect(store.getUserCompletedOrders).toBeDefined();
    });

    it('should have a getUserOrders method', () => {
        expect(store.getUserOrders).toBeDefined();
    });

    it('should have a getUserOrderById method', () => {
        expect(store.getUserOrderById).toBeDefined();
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have an updateOrderStatus method', () => {
        expect(store.updateOrderStatus).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('updateOrderStatus method should update the order status ', async () => {
        const result = await store.updateOrderStatus('2', 'complete');
        expect(result).toEqual({
            id: 2,
            status: 'complete',
            user_id: '1',
        });
    });

    it('create method should add an order', async () => {
        const result = await store.create(order);
        expect(result).toEqual({
            id: 3,
            status: 'active',
            user_id: '1',
        });
    });

    it('index method should return a list of orders', async () => {
        const result = await store.index();
        expect(result.length).toEqual(2);
    });

    it('getUserOrders method should return a list of user orders', async () => {
        const result = await store.getUserOrders('1');
        expect(result).toEqual([
            {
                id: 2,
                status: 'complete',
                user_id: '1',
            },
            {
                id: 3,
                status: 'active',
                user_id: '1',
            },
        ]);
    });

    it('getUserOrderById method should return a user order by id', async () => {
        const result = await store.getUserOrderById('3', '1');
        expect(result).toEqual({
            id: 3,
            status: 'active',
            user_id: '1',
        });
    });

    it('getUserActiveOrder method should return the user active order', async () => {
        const result = await store.getUserActiveOrder('1');
        expect(result).toEqual({
            id: 3,
            status: 'active',
            user_id: '1',
        });
    });

    it('getUserCurrentOrder method should return the user current order', async () => {
        const result = await store.getUserCurrentOrder('1');
        expect(result).toEqual({
            id: 3,
            status: 'active',
            user_id: '1',
        });
    });

    it('getUserProcessedOrders method should return a list of user processed orders', async () => {
        const result = await store.getUserProcessedOrders('1');
        expect(result.length).toEqual(0);
    });

    it('getUserCompletedOrders method should return a list of user completed orders', async () => {
        const result = await store.getUserCompletedOrders('1');
        expect(result).toEqual([
            {
                id: 2,
                status: 'complete',
                user_id: '1',
            },
        ]);
    });

    it('show method should return the correct order by id', async () => {
        const result = await store.show('3');
        expect(result).toEqual({
            id: 3,
            status: 'active',
            user_id: '1',
        });
    });

    it('delete method should remove the order by id', async () => {
        await store.delete('3');
        const result = await store.index();
        expect(result.length).toBe(1);
    });

    it('create an order for the rest of tests', async () => {
        const result = await store.create(order);
        expect(result).toEqual({
            id: 4,
            status: 'active',
            user_id: '1',
        });
    });
});
