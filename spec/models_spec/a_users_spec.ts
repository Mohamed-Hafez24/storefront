import { UserStore } from '../../src/models/user';
import { User } from '../../src/types/user.type';

const store = new UserStore();

describe('User Model', () => {
    const user: User = {
        first_name: 'blue',
        last_name: 'Boy',
        email: 'blue@gmail.com',
        password: 'b123',
        user_role: 'admin',
    };

    it('should have a getUserById method', () => {
        expect(store.getUserById).toBeDefined();
    });

    it('should have a getUserByEmail method', () => {
        expect(store.getUserByEmail).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have an update method', () => {
        expect(store.update).toBeDefined();
    });

    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('create method should add a new user', async () => {
        const result = await store.create(user);
        expect(result).toBeTruthy();
        expect(result.email).toEqual('blue@gmail.com');
        expect(result.password).toBeTruthy;
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
    });

    it('getUserById method should return the a user by id', async () => {
        const result = await store.getUserById(3);
        expect(result).toBeTruthy();
        expect(result.id).toBe(3);
        expect(result.email).toEqual('blue@gmail.com');
    });

    it('update method should update the user', async () => {
        const newUser: User = {
            id: 3,
            first_name: 'yellow',
            last_name: 'boy',
            email: 'yellow@gmail.com',
            password: 'y123',
            user_role: 'admin',
        };
        const result = await store.update(newUser);
        expect(result).toBeTruthy();
        expect(result.first_name).toEqual('yellow');
        expect(result.last_name).toEqual('boy');
        expect(result.email).toEqual('yellow@gmail.com');
        expect(result.password).toBeTruthy;
    });

    it('authenticate method should authenticate the user', async () => {
        const rightUser = await store.authenticate('yellow@gmail.com', 'y123');
        expect(rightUser).toBeTruthy();

        // with wrong password
        try {
            await store.authenticate('yellow@gmail.com', '543d');
        } catch (error) {
            expect(error).toMatch(/Authentication Failed/);
        }
    });

    it('getUserByEmail method should return the a user by email', async () => {
        const result = await store.getUserByEmail('yellow@gmail.com');
        expect(result).toBeTruthy();
        expect(result.id).toBe(3);
        expect(result.last_name).toEqual('boy');
    });

    it('delete method should remove a user by id', async () => {
        await store.delete(3);
        const result = await store.index();
        expect(result.length).toEqual(1);
        expect(result).not.toBeFalsy;
    });
});
