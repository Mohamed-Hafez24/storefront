#### Table of Contents
- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [Project Setup and Running](#project-setup-and-running)
- [Testing](#testing)
- [Important Notes](#important-notes)
- [Anatomy of storefront endpoints](REQUIREMENTS.md/#anatomy-of-storefront-endpoints)
    - [Products](REQUIREMENTS.md/#products)
    - [Users](REQUIREMENTS.md/#users)
    - [Orders](REQUIREMENTS.md/#orders)
    - [Cart](REQUIREMENTS.md/#cart)
    - [Dashboard](REQUIREMENTS.md/#dashboard) 
- [Database Schema](REQUIREMENTS.md/#database-schema)
- [Data Shapes](REQUIREMENTS.md/#data-shapes)
## Introduction
This is a simple backend API for an online store to handle products, users, orders. It has different endpoints covering all CRUD operations.

## Technology Stack 
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Jasmine](https://img.shields.io/badge/jasmine-%238A4182.svg?style=for-the-badge&logo=jasmine&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

This API built with
- `Node.js`:    Back-end JavaScript runtime environment.
- `Express`:    Node.js web application framework.
- `Typescript`: Is JavaScript with syntax for types.
- `NPM`:        As a package manager.
- `PostgreSQL`: As a Database.
- `db-migrate`: For migrations.
- `jsonwebtoken(JWT)`: For users authorization  
- `Jasmine`:    For Unit testing.
- `ESLint`:     JS linting tool.
- `prettier`:   Code formatting tool.

## Project Setup and Running
By following the instruction below , you will be able to set up and run the project locally on your machine.

#### 1. Install project dependencies
``` 
npm install 
```
#### 2. Database Setup
You have to create two databases one for development and another for testing.

- open your shell and connect to the default postgres database via psql
    ```
    psql -U postgres
    ```
- create the dev and test database
    ```
    CREATE DATABASE storefront;
    CREATE DATABASE storefront_test;
    ````
- create a new user 
    ```
    CREATE USER storefront_user WITH PASSWORD 'pass123';
    ```
- grant all privileges on the storefront and storefront_test databases to the new user
    ```
    \c storefront
    GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
    \c storefront_test
    GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
    ```

#### 3. Environment Setup 
You need to create `.env` file in the root directory and add these environment variables to it. 
```
PORT=3000
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=pass123
ENV=dev

BCRYPT_PASSWORD=spreak-friend-and-enter
SALT_ROUNDS=10
TOKEN_SECRET=NEWStoreFrontTKN!

TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ1NDk2OTc0fQ.mE1P84E0XJZytIkjs8e41yNFMbja0hdOPVgmKpxuOYs
```
#### 4. Run the migration
Use this command to run the migrations, to create the tables in the database.
```
db-migrate up
```
#### 5. Running the App
Use this command to run the app in watch mode.
```
npm run watch
```
- The app will run on port 3000 | `localhost:3000`
________________________________________________________________________________________________________________________________
### Testing
Use this command to run the unit tests with jasmin.
```
npm run test
```



