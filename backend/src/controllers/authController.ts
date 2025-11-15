import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const token = generateToken({
            id: String(admin._id),
            email: admin.email,
            role: admin.role,
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ success: false, message: 'Admin already exists' });
            return;
        }

        const admin = await Admin.create({
            email,
            password,
            name,
            role: 'admin',
        });

        const token = generateToken({
            id: String(admin._id),
            email: admin.email,
            role: admin.role,
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                token,
                admin: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findById(req.admin?.id).select('-password');

        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }

        res.json({
            success: true,
            data: admin,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to get profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email } = req.body;

        const admin = await Admin.findByIdAndUpdate(
            req.admin?.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: admin,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin?.id);
        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }

        const isPasswordValid = await admin.comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Current password is incorrect' });
            return;
        }

        admin.password = newPassword;
        await admin.save();

        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Failed to change password' });
    }
};

