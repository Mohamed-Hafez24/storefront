import supertest from 'supertest';
import app from '../../src/app';
import { User } from '../../src/types/user.type';

// test endpoint
const request = supertest(app);
const TOKEN: string = process.env.TEST_TOKEN ?? '';

describe('Test Users Controller Endpoints Response', () => {
    const user: User = {
        first_name: 'Green',
        last_name: 'Boy',
        email: 'green@gmail.com',
        password: 'g123',
        user_role: 'admin',
    };

    it('post    => /store/users   ==> expect create to create new user', async () => {
        const response = await request
            .post('/store/users')
            .send(user)
            .set('Accept', 'application/json');
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toBeTruthy;
    });

    it('get     => /store/users   ==> expect index to return all users', async () => {
        const response = await request
            .get('/store/users')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('get     => /store/users/:id ==> expect show to return the user by id', async () => {
        const response = await request
            .get('/store/users/1')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(1);
        expect(response.body.email).toEqual('green@gmail.com');
    });

    it('post    => /store/users/login   ==> expect login to authenticate the user', async () => {
        const rightPassword = await request
            .post('/store/users/login')
            .send({ email: 'green@gmail.com', password: 'g123' })
            .set('Accept', 'application/json');
        expect(rightPassword.headers['content-type']).toMatch(/json/);
        expect(rightPassword.status).toEqual(200);
        expect(rightPassword.body).toBeTruthy;

        const wrongPassword = await request
            .post('/store/users/login')
            .send({ email: 'green@gmail.com', password: 'As123' })
            .set('Accept', 'application/json');
        expect(wrongPassword).toThrowError;
    });

    it('put     => /store/users/:id ==> expect update to update the user by id', async () => {
        const updateUser: User = {
            first_name: 'red',
            last_name: 'boy',
            email: 'red@gmail.com',
            password: 'r123',
            user_role: 'admin',
        };
        const response = await request
            .put('/store/users/1')
            .send(updateUser)
            .set('Accept', 'application/json')
            .set('authorization', 'Bearer ' + TOKEN)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);
        expect(response.body).toBeTruthy;
    });

    it('delete  => /store/users/:id ==> expect remove to delete the user by id', async () => {
        // create new user to test delete function and keep the first user for other tests
        const userForDelete: User = {
            first_name: 'mohamed',
            last_name: 'hafez',
            email: 'mohamed@gmail.com',
            password: 'm123',
            user_role: 'user',
        };
        const resp = await request.post('/store/users').send(userForDelete);
        expect(resp.status).toEqual(200);

        const res = await request
            .delete('/store/users/2')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(res.status).toBe(200);

        const response = await request
            .get('/store/users')
            .set('authorization', 'Bearer ' + TOKEN);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });
});
