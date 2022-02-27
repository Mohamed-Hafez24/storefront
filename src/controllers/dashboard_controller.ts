import { Request, Response, Router } from 'express';
import { verifyAdminUser } from '../middlewars/verify_token';
import { DashboardQueries } from '../services/dashboard.service';
import {
    PopularProducts,
    UsersWithOrders,
    ProductsInOrders,
} from '../types/dashboard.type';

// Get instance of dashboard Store
const dashboard = new DashboardQueries();

// Get Top five popular products
async function fiveMostPopularProducts(
    _req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        const users: PopularProducts[] =
            await dashboard.fiveMostPopularProducts();
        return res.json(users);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get users that made orders and orders amount for each user
async function usersWithOrders(
    _req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        const users: UsersWithOrders[] = await dashboard.usersWithOrders();
        return res.json(users);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get Products that included in orders
async function productsInOrders(
    _req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        const products: ProductsInOrders[] = await dashboard.productsInOrders();
        return res.json(products);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Create orders route object
const dashboardRoutes: Router = Router();

/* set the orders endpoints */
// Access ==> only admin
dashboardRoutes.get(
    '/five-top-popular-products',
    verifyAdminUser,
    fiveMostPopularProducts
); // Get Top five popular products
dashboardRoutes.get('/products-in-orders', verifyAdminUser, productsInOrders); // Get Products that included in orders
dashboardRoutes.get('/users-with-orders', verifyAdminUser, usersWithOrders); // Get users that made orders and orders number

export default dashboardRoutes;
