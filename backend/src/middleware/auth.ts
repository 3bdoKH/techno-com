import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
    admin?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ success: false, message: 'Access token required' });
            return;
        }

        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(403).json({ success: false, message: 'Invalid or expired token' });
                return;
            }

            req.admin = decoded as { id: string; email: string; role: string };
            next();
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.admin?.role !== 'super-admin') {
        res.status(403).json({ success: false, message: 'Super admin access required' });
        return;
    }
    next();
};

