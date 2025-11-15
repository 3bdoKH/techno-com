import jwt, { SignOptions } from 'jsonwebtoken';

interface JwtConfig {
    jwtSecret: string;
    jwtExpiresIn: number;
}

const config: JwtConfig = {
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: 7 * 60 * 60 * 24,
};

export const generateToken = (
    payload: { id: string; email: string; role: string }
): string => {
    const options: SignOptions = { expiresIn: config.jwtExpiresIn as unknown as number };
    return jwt.sign(payload, config.jwtSecret, options as SignOptions);
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, config.jwtSecret as string);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

