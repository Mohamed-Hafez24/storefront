import { Request, Response, Router } from 'express';
import { verifyUser } from '../middlewars/verify_token';
import { Cart } from '../services/cart.service';
import { CartReturn } from '../types/cart.type';

// Get instance from cart service
const cartService = new Cart();

async function addProduct(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const userId: string = req.params.userId;
    const productId: string = req.body.productId;
    const quantity: number = parseInt(req.body.quantity);
    try {
        if (
            isNaN(parseInt(userId)) ||
            isNaN(parseInt(productId)) ||
            isNaN(quantity)
        )
            throw new Error('Enter valid values');
        const addedProduct: CartReturn = await cartService.addProduct(
            userId,
            productId,
            quantity
        );
        return res.json(addedProduct);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Create cart route object
const cartRoutes: Router = Router();

/* set the cart endpoints */
// Access => login user or admin
cartRoutes.post('/user/:userId/order/products', verifyUser, addProduct); // add product to user cart

export default cartRoutes;
