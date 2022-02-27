import { Router, Request, Response } from 'express';
import cartRoutes from './cart_controller';
import dashboardRoutes from './dashboard_controller';
import orderRoutes from './orders_controller';
import productRoutes from './products_controller';
import userRoutes from './users_controller';

// create the root route object
const route: Router = Router();

// set the root endpoint
route.get('/', function (req: Request, res: Response): void {
    res.send('Welcome To storefront API (:-)');
});

// setting the path to the app routes middlewares
route.use('/products', productRoutes);
route.use('/orders', orderRoutes);
route.use('/users', userRoutes);
route.use('/dashboard', dashboardRoutes);
route.use('/cart', cartRoutes);

export default route;
