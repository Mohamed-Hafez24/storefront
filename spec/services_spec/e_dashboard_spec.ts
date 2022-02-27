import { DashboardQueries } from '../../src/services/dashboard.service';

const dashboard = new DashboardQueries();

describe('Dashboard Service', () => {
    it('should have a fiveMostPopularProducts method', () => {
        expect(dashboard.fiveMostPopularProducts).toBeDefined();
    });

    it('should have a usersWithOrders method', () => {
        expect(dashboard.usersWithOrders).toBeDefined();
    });

    it('should have a productsInOrders method', () => {
        expect(dashboard.productsInOrders).toBeDefined();
    });

    it('fiveMostPopularProducts method should return list of top 5 popular products an order', async () => {
        const result = await dashboard.fiveMostPopularProducts();
        expect(result.length).toBeGreaterThan(0);
    });

    it('usersWithOrders method should return a list users that made orders and the number of orders for each user', async () => {
        const result = await dashboard.usersWithOrders();
        expect(result.length).toBeGreaterThan(0);
    });

    it('productsInOrders method should return a list of products that have been included in orders', async () => {
        const result = await dashboard.productsInOrders();
        expect(result.length).toBeGreaterThan(0);
    });
});
