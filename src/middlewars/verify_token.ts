import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenData } from '../types/tokenData.type';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.TOKEN_SECRET) {
    throw new Error('Unexpected error: Missing TOKEN_SECRET');
}
const TOKEN_SECRET: string = process.env.TOKEN_SECRET;

// to get the data from the token
function verifyAuthToken(req: Request, res: Response): TokenData | undefined {
    try {
        const headerAuth: string | undefined = req.headers.authorization;
        if (!headerAuth) throw new Error('User not authorized!');

        const [tokenType, token] = headerAuth.split(' ');
        if (tokenType.toLowerCase() !== 'bearer' || !token)
            throw new Error('User not authorized!');

        const decoded: TokenData = jwt.verify(token, TOKEN_SECRET) as TokenData;
        if (!decoded) throw new Error('User not authorized!');

        return decoded;
    } catch (error) {
        res.status(403);
        res.json('Access denied. ' + error);
    }
}

// to verify that the user is the current login user
export const verifyLoginUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const data: TokenData | undefined = verifyAuthToken(req, res);
        if (!data) throw new Error('Access denied. ');
        if (data.id !== parseInt(req.params.userId))
            throw new Error('Access denied. invalid token');
        next();
    } catch (error) {
        res.status(403);
        res.json(`${error}`);
    }
};

// to verify that the user is Admin
export const verifyAdminUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const data: TokenData | undefined = verifyAuthToken(req, res);
        if (!data) throw new Error('Access denied. ');
        if (data.role !== 'admin')
            throw new Error('Access denied. Only Admin`');
        next();
    } catch (error) {
        res.status(403);
        res.json(`${error}`);
    }
};

// to verify that the user is Admin or the current login user
export const verifyUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const data: TokenData | undefined = verifyAuthToken(req, res);
        if (!data) throw new Error('No Data Provided');
        if (data.id !== parseInt(req.params.userId) && data.role !== 'admin')
            throw new Error('Access denied. invalid token');
        next();
    } catch (error) {
        res.status(403);
        res.json(`${error}`);
    }
};
