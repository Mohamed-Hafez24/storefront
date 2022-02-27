import bcrypt from 'bcrypt';

if (!process.env.SALT_ROUNDS) {
    throw new Error('Unexpected error: Missing SALT_ROUNDS');
}
const saltRounds: string = process.env.SALT_ROUNDS;

if (!process.env.BCRYPT_PASSWORD) {
    throw new Error('Unexpected error: Missing BCRYPT_PASSWORD ');
}
const pepper: string = process.env.BCRYPT_PASSWORD;

// encrypt user password
export const encryptPass = async (pass: string): Promise<string> => {
    const hash: string = bcrypt.hashSync(pass + pepper, parseInt(saltRounds));
    return hash;
};

// dencrypt user password
export const decryptPass = async (
    loginPassword: string,
    storedPassword: string
): Promise<boolean> => {
    if (bcrypt.compareSync(loginPassword + pepper, storedPassword)) {
        return true;
    }
    throw new Error('Invalid Password');
};
