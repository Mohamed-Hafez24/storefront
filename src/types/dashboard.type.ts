export type PopularProducts = {
    name: string;
    total_quantity: number;
    number_of_orders: number;
};

export type UsersWithOrders = {
    firstName: string;
    lastName: string;
    orders_mount: number;
};

export type ProductsInOrders = {
    name: string;
    price: number;
    category: string;
    total_quantity: number;
    order_id: string;
};
