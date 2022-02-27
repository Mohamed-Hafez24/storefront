import { ProductStore } from '../../src/models/product';
import { Product } from '../../src/types/product.type';

const store = new ProductStore();

describe('Product Model', () => {
    const product: Product = {
        name: 'laptop',
        price: 200,
        description: 'Good product with high quality',
        category: 'electronics',
    };

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have an getProductsByCategory method', () => {
        expect(store.getProductsByCategory).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have an update method', () => {
        expect(store.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('create method should add a product', async () => {
        const result = await store.create(product);
        expect(result).toEqual({
            id: 3,
            name: 'laptop',
            price: 200,
            description: 'Good product with high quality',
            category: 'electronics',
        });
    });

    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result.length).toEqual(2);
    });

    it('getProductsByCategory method should return a products by category', async () => {
        const result = await store.getProductsByCategory('electronics');
        expect(result).toEqual([
            {
                id: 1,
                name: 'Gaming keyboard',
                price: 50,
                description: 'Good brand with high quality',
                category: 'electronics',
            },
            {
                id: 3,
                name: 'laptop',
                price: 200,
                description: 'Good product with high quality',
                category: 'electronics',
            },
        ]);
    });

    it('update method should update the product', async () => {
        const updatedProduct = {
            id: 3,
            name: 'Gaming Keyboard',
            price: 100,
            description: 'Good product with high quality',
            category: 'electronics',
        };
        const result = await store.update(updatedProduct);
        expect(result).toBeTruthy();
    });

    it('show method should return the correct product', async () => {
        const result = await store.show('3');
        expect(result).toEqual({
            id: 3,
            name: 'Gaming Keyboard',
            price: 100,
            description: 'Good product with high quality',
            category: 'electronics',
        });
    });

    it('delete method should remove the product', async () => {
        await store.delete('3');
        const result = await store.index();
        expect(result.length).toEqual(1);
    });
});
