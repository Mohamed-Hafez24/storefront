import { Request, Response, Router } from 'express';
import { verifyAdminUser } from '../middlewars/verify_token';
import { ProductStore } from '../models/product';
import { Product } from '../types/product.type';

// get instance of the product model
const store: ProductStore = new ProductStore();

// Get all products
async function index(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        let products: Product[];
        const category: string = req.query.category as string;
        // check if there is a query parametr called category
        if (category)
            products = await store.getProductsByCategory(category.trim());
        else products = await store.index();
        return res.json(products);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Get product by product id
async function show(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.productId)))
            throw new Error('Invalid productId');
        const product: Product = await store.show(req.params.productId);
        return res.json(product);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// create product
async function create(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const product: Product = {
        name: req.body.name.trim(),
        price: parseInt(req.body.price),
        description: req.body.description || '',
        category: req.body.category.trim() || '',
    };
    try {
        if (!product.name || isNaN(product.price))
            throw new Error('Invalid product name or price');
        const newProduct: Product = await store.create(product);
        return res.json(newProduct);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// update product by product id
async function update(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const product: Product = {
        id: parseInt(req.params.productId),
        name: req.body.name,
        price: parseInt(req.body.price),
        description: req.body.description || '',
        category: req.body.category || '',
    };
    try {
        if (!product.name.trim() || isNaN(product.price) || isNaN(product.id!))
            throw new Error('Invalid product name or price');
        const updatedProduct: Product = await store.update(product);
        return res.json(updatedProduct);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// delete product by product id
async function remove(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.productId)))
            throw new Error('Invalid productId');
        const deletedProduct: Product = await store.delete(
            req.params.productId
        );
        return res.json(deletedProduct);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// Create products route object
const productRoutes: Router = Router();

/* set the products endpoints */
// Access => Anyone
productRoutes.get('/', index); // Get all products or query by category name ?category=fashion
productRoutes.get('/:productId', show); // Get product by product id

// Access => Only Admin
productRoutes.post('/', verifyAdminUser, create); // create product
productRoutes.put('/:productId', verifyAdminUser, update); // update product by product id
productRoutes.delete('/:productId', verifyAdminUser, remove); // delete product by product id

export default productRoutes;
