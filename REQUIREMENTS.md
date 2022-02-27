#### Table of Contents
- [Introduction](README.md/#introduction)
- [Technology Stack](README.md/#technology-stack)
- [Project Setup and Running](README.md/#project-setup-and-running)
- [Testing](README.md/#testing)
- [Important Notes](#important-notes)
- [Anatomy of storefront endpoints](#anatomy-of-storefront-endpoints)
    - [Products](#products)
    - [Users](#users)
    - [Orders](#orders)
    - [Cart](#cart)
    - [Dashboard](#dashboard) 
- [Database Schema](#database-schema)
- [Data Shapes](#data-shapes)
----------------------------------------------------------
#### Important Notes
##### 1. You need to set Authorization Variable with the HTTP header As below:
```Authorization```:   ```bearer <token>```
##### 2. You can use any API testing tool like `Postman` to test the endpoints.
 ```You will find postman collection file in the project repository, it has all endpoints setup for quick testing``` (__preferred to use it__)
##### 3. To test the project without any Access Denied messages, create an admin user as he has all the privileges, so set the `user_role:'admin'`
-------------------------------------------------------------
## Anatomy of Storefront Endpoints

<h4>Products</h4>
-> product = { name: string, price: number, describtion: string, category:string } <br>
-> [{product}] : list of product objects <br> <br>

| Method   | URL                                          | Description                     | Access  | Request Header | Request Body  | Response Body   |  
| -------- | ---------------------------------------------| --------------------------------| ------- | -------------- | ------------- | --------------- |
| `GET`    | `/store/products`                            | Retrieve all products.          | Anyone  |                |               | [{id+product}]  |
| `GET`    | `/store/products?category=[CategoryName]`    | Retrieve products by category.  | Anyone  |                |               | [{id+product}]  |
| `GET`    | `/store/products/:productId`                 | Get product details by id.      | Anyone  |                |               | {id+product}    |
| `POST`   | `/store/products`                            | Create new product.             | Admin   | Authorization  | {product}     | {id+product}    |
| `PUT`    | `/store/products/:productId`                 | Update product by product id    | Admin   | Authorization  | {product}     | {id+product}    |
| `DELETE` | `/store/products/:productId`                 | Delete product by product id    | Admin   | Authorization  |               | {id+product}    |
________________________________________________________________________________________________________________________________

<h4>Users</h4>
-> user = { first_name: string, last_name: string, email: string, password: string, user_role: string } <br>
-> [{user}] : List of user objects <br>
-> login-data = {email: string, password: string } <br> <br>

| Method   | URL                       | Description                                 | Access              | Request Header | Request Body  | Response Body  |
| -------- | --------------------------| --------------------------------------------| ------------------- | -------------- | ------------- | -------------- |
| `POST`   | `/store/users`            | Create a new user.                          | Anyone              |                |  {user}       | JWT Token      |
| `POST`   | `/store/users/login`      | Use to login a user by email and password.  | Anyone              |                |  {login-data} | JWT Token      |
| `PUT`    | `/store/users/:userId`    | Update user data by id.                     | login-User / Admin  | Authorization  |  {user}       | JWT Token      |
| `GET`    | `/store/users/:userId`    | Retrieve user data by id.                   | login-User / Admin  | Authorization  |               | {id+user}      | 
| `GET`    | `/store/users`            | Retrieve all users.                         | Admin               | Authorization  |               | [{id+user}]    |
| `DELETE` | `/store/users/:userId`    | Delete a user by id.                        | Admin               | Authorization  |               | {id+user}      | 
________________________________________________________________________________________________________________________________

<h4>Orders</h4>
-> order = { status:string, user_id: string} <br>
-> [{order}] : List of order objects <br><br>

| Method   | URL                                      | Description                          | Access              | Request Header | Request Body  | Response Body  |
| -------- | -----------------------------------------| -------------------------------------| ------------------- | -------------- | ------------- | -------------- |
| `POST`   | `/store/orders/user/:userId`             | Create new order                     | login-User / Admin  | Authorization  | {order}       | {order}        |
| `GET`    | `/store/orders/user/:userId`             | Get user orders by user id           | login-User / Admin  | Authorization  |               | [{order}]      |
| `GET`    | `/store/orders/:ordertId/user/:userId`   | Get specific order for specific user | login-User / Admin  | Authorization  |               | {order}        |
| `GET`    | `/store/orders/current/user/:userId`     | Retrieve user current order.         | login-User / Admin  | Authorization  |               | {order}        |
| `GET`    | `/store/orders/active/user/:userId`      | Retrieve user active order.          | login-User / Admin  | Authorization  |               | {order}        |
| `GET`    | `/store/orders/processed/user/:userId`   | Retrieve user processed orders.      | login-User / Admin  | Authorization  |               | [{order}]      |
| `GET`    | `/store/orders/completed/user/:userId`   | Retrieve user completed orders.      | login-User / Admin  | Authorization  |               | [{order}]      |
| `GET`    | `/store/orders`                          | Retrieve all orders.                 | Admin               | Authorization  |               | [{order}]      |
| `PUT`    | `/store/orders/:orderId`                 | Delete one orders by id.             | Admin               | Authorization  | {order}       | {order}}       |
| `DELETE` | `/store/orders/:orderId`                 | Delete one orders by id.             | Admin               | Authorization  |               | {order}        |
________________________________________________________________________________________________________________________________

<h4>Cart</h4>
-> cart = { productId: string, quantity: string  } <br>
-> CartReturn = { id: number, quantity: number, order_id: string, product_id: string } <br> <br>

| Method   | URL                                        | Description                  | Access             | Request Header | Request Body | Response Body  |   
| -------- | -------------------------------------------| -----------------------------| -------------------| -------------- | ------------ | -------------- |   
| `POST`   | `/store/cart/user/:userId/order/products`  | Add product to the user cart | login-User / Admin | Authorization  | {cart}       | {CartReturn}   |   
________________________________________________________________________________________________________________________________

<h4>Dashboard</h4>
-> PopularProducts = { name: string, total_quantity:number, number_of_orders: number } <br>
-> UsersWithOrders = { firstName: string, lastName: string, orders_mount :number } <br>
-> ProductsInOrders = { name: string, price: number, category: string, total_quantity:number, order_id: string } <br> <br>

| Method   | URL                                          | Description                          | Access | Request Header | Request Body | Response Body     |
| -------- | ---------------------------------------------| -------------------------------------| -------| -------------- | -------------| --------------    |
| `GET`    | `/store/dashboard/five-top-popular-products` | Retrieve top 5 popular products.     | Admin  | Authorization  |              | {PopularProducts} |
| `GET`    | `/store/dashboard/products-in-orders`        | Retrieve products included in orders.| Admin  | Authorization  |              | {UsersWithOrders} |
| `GET`    | `/store/dashboard/users-with-orders`         | Retrieve users that made orders.     | Admin  | Authorization  |              | {ProductsInOrders}|

________________________________________________________________________________________________________________________________

## Database Schema 

```

| Table Name         | Columns Name        |  Data Type      |  Comments                         |
| ------------------ |  ------------------ |  -------------- |  -------------------------------- |
| `products`         | `id`                |  `SERIAL`       |  [PRIMARY KEY]                    |
|                    | `name`              |  `VARCHAR(100)` |                                   |
|                    | `price`             |  `integer`      |                                   |
|                    | `description`       |  `text`         |                                   |
|                    | `category`          |  `VARCHAR(64)`  |                                   |
| ------------------ | ------------------- |  -------------- |  -------------------------------  |
| `users`            | `id`                |  `SERIAL`       |  [PRIMARY KEY]                    |
|                    | `first_name`        |  `VARCHAR(100)` |                                   |
|                    | `last_name`         |  `VARCHAR(100)` |                                   |
|                    | `email`             |  `VARCHAR`      |                                   |
|                    | `password_digest`   |  `VARCHAR`      |                                   |
|                    | `user_role`         |  `VARCHAR`      |                                   |
| ------------------ | ------------------- |  -------------- |  -------------------------------- |
| `orders`           | `id`                |  `SERIAL`       |  [PRIMARY KEY]                    |
|                    | `status`            |  `VARCHAR(15)`  |                                   |
|                    | `user_id`           |  `bigint`       |  [foreign key to users table]     |
| ------------------ | ------------------- |  -------------- | --------------------------------- |
| `order_products`   | `id`                |  `SERIAL`       |  [PRIMARY KEY]                    |
|                    | `quantity`          |  `integer`      |                                   |
|                    | `order_id`          |  `bigint`       |  [foreign key to orders table]    |
|                    | `product_id`        |  `bigint`       |  [foreign key to products table]  |

```

________________________________________________________________________________________________________________________________

## Data Shapes
#### Product
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;

#### User
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_role: string;

#### Orders
    id: number;
    status: string;
    user_id: string;
    quantity: number;
    product_id: string;

