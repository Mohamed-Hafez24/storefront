import { Cart } from '../../src/services/cart.service';

const cartService = new Cart();

describe('Cart Service', () => {
    it('should have addProduct method', () => {
        expect(cartService.addProduct).toBeDefined();
    });

    it('addProduct method should add a product to the cart', async () => {
        const result = await cartService.addProduct('1', '1', 5);
        expect(result).toEqual({
            id: 2,
            quantity: 5,
            order_id: '4',
            product_id: '1',
        });
    });
});
