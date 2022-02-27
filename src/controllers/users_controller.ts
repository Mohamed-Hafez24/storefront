import { Request, Response, Router } from 'express';
import { verifyAdminUser, verifyUser } from '../middlewars/verify_token';
import { UserStore } from '../models/user';
import { User } from '../types/user.type';
import { generateToken } from '../utilities/generate_token';

// get instance of the user model
const store: UserStore = new UserStore();

// to register and create new user account
async function create(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const user: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.user_role || 'user',
    };
    try {
        if (
            !user.first_name ||
            !user.last_name ||
            !user.email ||
            !user.password ||
            !user.user_role
        )
            throw new Error('Invalid value: check your values');
        const newUser: User = await store.create(user);
        if (newUser.id && newUser.user_role) {
            const token: string = await generateToken(
                newUser.id,
                newUser.user_role
            );
            //return res.json(newUser)
            return res.json(token);
        } else throw new Error('unable to create new user');
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// to login to the app
async function login(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const email: string = req.body.email;
    const password: string = req.body.password;
    try {
        if (!email) throw new Error('Enter Valid email value');
        if (!password) throw new Error('Enter Valid password value');
        const user: User = await store.authenticate(email, password);
        if (user.id && user.email) {
            const token: string = await generateToken(user.id, user.user_role);
            //return res.json(user)
            return res.json(token);
        } else throw new Error('invalid email and password');
    } catch (error) {
        res.status(401);
        res.json(`${error}`);
    }
}

// to get all users data
async function index(
    _req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        const users: User[] = await store.index();
        return res.json(users);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// to delete user
async function remove(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('Invalid user id value');
        const deletedUser: User = await store.delete(
            parseInt(req.params.userId)
        );
        return res.json(deletedUser);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// to get user data
async function getUserById(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    try {
        if (isNaN(parseInt(req.params.userId)))
            throw new Error('Invalid user id value');
        const user: User = await store.getUserById(parseInt(req.params.userId));
        return res.json(user);
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

// to update user data
async function update(
    req: Request,
    res: Response
): Promise<Response | undefined> {
    const user: User = {
        id: parseInt(req.params.userId),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.user_role || 'user',
    };
    try {
        if (
            isNaN(user.id!) ||
            !user.first_name ||
            !user.last_name ||
            !user.email ||
            !user.password ||
            !user.user_role
        )
            throw new Error('Invalid value: check your values');
        const updatedUser: User = await store.update(user);
        if (updatedUser.id && updatedUser.user_role) {
            const token: string = await generateToken(
                updatedUser.id,
                updatedUser.user_role
            );
            //return res.json(updatedUser)
            return res.json(token);
        } else throw new Error('unable to update the user');
    } catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
}

/* Create users route object */
const userRoutes: Router = Router();

/* set the users endpoints */
// Access ==> non login usesrs
userRoutes.post('/', create); // to register and create new account
userRoutes.post('/login', login); // to login to the app

// Access ==> only Admin
userRoutes.get('/', verifyAdminUser, index); // to get all users data
userRoutes.delete('/:userId', verifyAdminUser, remove); // to delete user

// Access ==> login user or Admin
userRoutes.put('/:userId', verifyUser, update); // to update user data
userRoutes.get('/:userId', verifyUser, getUserById); // to get user data

export default userRoutes;
