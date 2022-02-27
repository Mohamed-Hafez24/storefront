import jwt from 'jsonwebtoken';

if (!process.env.TOKEN_SECRET) {
    throw new Error('Unexpected error: Missing TOKEN_SECRET');
}
const TOKEN_SECRET: string = process.env.TOKEN_SECRET;

// generate token
export const generateToken = async (
    id: number,
    role: string
): Promise<string> => {
    const token: string = jwt.sign({ id: id, role: role }, TOKEN_SECRET);
    return token;
};
