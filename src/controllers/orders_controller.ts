import { Request, Response, Router } from 'express';
import { verifyAdminUser, verifyUser } from '../middlewars/verify_token';
import { OrderStore } from '../models/order';
import { Order } from '../types/order.type';

// get instance of the order model
const store: OrderStore = new OrderStore();

// Get user orders by user id
async function getUserOrders(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('invalid userId');
        const orders: Order[] = await store.getUserOrders(req.params.userId);
        return res.json(orders);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get user specific order by order id and user id
async function getUserOrderById(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.orderId)))
            throw new Error('invalid orderId');
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('invalid userId');
        const order: Order = await store.getUserOrderById(
            req.params.orderId,
            req.params.userId
        );
        return res.json(order);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get user current order by user id
async function getUserCurrentOrder(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('invalid userId');
        const order: Order = await store.getUserCurrentOrder(req.params.userId);
        return res.json(order);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get user active orders by user id
async function getUserActiveOrder(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('invalid userId');
        const order: Order = await store.getUserActiveOrder(req.params.userId);
        return res.json(order);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get user completed orders by user id
async function getUserProcessedOrders(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('invalid userId');
        const order: Order[] = await store.getUserProcessedOrders(
            req.params.userId
        );
        return res.json(order);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get user completed orders by user id
async function getUserCompletedOrders(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('invalid userId');
        const order: Order[] = await store.getUserCompletedOrders(
            req.params.userId
        );
        return res.json(order);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Create new order
async function createOrder(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const order: Order = {
        user_id: req.params.userId,
        status: 'active',
    };
    try {
        if (isNaN(parseInt(order.user_id))) throw new Error('invalid userId');
        const newOrder: Order = await store.create(order);
        return res.json(newOrder);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get all orders
async function getAllOrders(
    _req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        const orders = await store.index();
        return res.json(orders);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Update order's status.
async function updateOrderStatus(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const order_id: string = req.params.orderId;
    const status: string = req.body.status;
    try {
        if (isNaN(parseInt(order_id))) throw new Error('invalid orderId');
        if (!status) throw new Error('invalid status value');
        if (status === 'active')
            throw new Error(
                `can't change Completed or Processed orders to be active order | if you need an active order create new order`
            );
        if (status !== 'complete' && status !== 'processing')
            throw new Error('invalid status value');
        const updatedOrder: Order = await store.updateOrderStatus(
            order_id,
            status
        );
        return res.json(updatedOrder);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Delete order by order id
async function deleteOrder(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.orderId)))
            throw new Error('invalid orderId');
        const deletedProduct: Order = await store.delete(req.params.orderId);
        return res.json(deletedProduct);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Create orders route object
const orderRoutes: Router = Router();

/* set the orders endpoints */
// Access ==> login user or admin
orderRoutes.get('/user/:userId', verifyUser, getUserOrders); // Get user orders by user id
orderRoutes.get('/current/user/:userId', verifyUser, getUserCurrentOrder); // Get user current order by user id
orderRoutes.get('/active/user/:userId', verifyUser, getUserActiveOrder); // Get user active orders by user id
orderRoutes.get('/processed/user/:userId', verifyUser, getUserProcessedOrders); // Get user completed orders by user id
orderRoutes.get('/completed/user/:userId', verifyUser, getUserCompletedOrders); // Get user completed orders by user id
orderRoutes.post('/user/:userId', verifyUser, createOrder); // create new order
orderRoutes.get('/:orderId/user/:userId', verifyUser, getUserOrderById); // Get user specific order by order id and user id

// Access ==> Only Admin
orderRoutes.get('/', verifyAdminUser, getAllOrders); // Get all orders
orderRoutes.put('/:orderId', verifyAdminUser, updateOrderStatus); // Update order's status.
orderRoutes.delete('/:orderId', verifyAdminUser, deleteOrder); // Delete order by order id

export default orderRoutes;
