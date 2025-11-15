import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest,
    ],
    authController.login
);// login

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').notEmpty().withMessage('Name is required'),
        validateRequest,
    ],
    authController.register
);// register

router.get('/profile', authenticateToken, authController.getProfile);

router.put(
    '/profile',
    authenticateToken,
    [
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        validateRequest,
    ],
    authController.updateProfile
);// update profile

router.post(
    '/change-password',
    authenticateToken,
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
        validateRequest,
    ],
    authController.changePassword
);// change password

export default router;

