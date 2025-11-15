import { Response, Request } from 'express';
import About from '../models/About';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const getActiveAboutSections = async (req: Request, res: Response): Promise<void> => {
    try {
        const { section } = req.query;
        const filter: any = { isActive: true };
        if (section) {
            filter.section = section;
        }
        const aboutSections = await About.find(filter).sort({ order: 1, createdAt: -1 });
        res.json({
            success: true,
            data: aboutSections,
            count: aboutSections.length,
        });
    } catch (error) {
        console.error('Get active about sections error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch about sections' });
    }
};

export const getAllAboutSections = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { section } = req.query;
        const filter = section ? { section } : {};
        const aboutSections = await About.find(filter).sort({ order: 1, createdAt: -1 });
        res.json({
            success: true,
            data: aboutSections,
            count: aboutSections.length,
        });
    } catch (error) {
        console.error('Get about sections error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch about sections' });
    }
};

export const getAboutById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) {
            res.status(404).json({ success: false, message: 'About section not found' });
            return;
        }
        res.json({
            success: true,
            data: about,
        });
    } catch (error) {
        console.error('Get about section error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch about section' });
    }
};

export const createAboutSection = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const images = req.files ? (req.files as Express.Multer.File[]).map(file => `/api/uploads/${file.filename}`) : [];
        const aboutData: any = {
            ...req.body,
            images: images.length > 0 ? images : req.body.images || [],
        };
        if (req.body.stats && typeof req.body.stats === 'string') {
            try {
                aboutData.stats = JSON.parse(req.body.stats);
            } catch (e) {
                aboutData.stats = [];
            }
        }

        if (typeof aboutData.isActive === 'string') {
            aboutData.isActive = aboutData.isActive === 'true';
        }
        if (typeof aboutData.order === 'string') {
            aboutData.order = parseInt(aboutData.order, 10) || 0;
        }
        const about = await About.create(aboutData);
        res.status(201).json({
            success: true,
            message: 'About section created successfully',
            data: about,
        });
    } catch (error: any) {
        console.error('Create about section error:', error);
        const errorMessage = error.errors
            ? Object.values(error.errors).map((e: any) => e.message).join(', ')
            : error.message || 'Failed to create about section';
        res.status(500).json({ success: false, message: errorMessage });
    }
};

export const updateAboutSection = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const newImages = req.files ? (req.files as Express.Multer.File[]).map(file => `/api/uploads/${file.filename}`) : [];

        const updateData: any = {
            ...req.body,
            ...(newImages.length > 0 && { images: newImages }),
        };

        if (req.body.stats && typeof req.body.stats === 'string') {
            try {
                updateData.stats = JSON.parse(req.body.stats);
            } catch (e) {
            }
        }

        if (typeof updateData.isActive === 'string') {
            updateData.isActive = updateData.isActive === 'true';
        }
        if (typeof updateData.order === 'string') {
            updateData.order = parseInt(updateData.order, 10) || 0;
        }

        if (newImages.length > 0) {
            const oldAbout = await About.findById(req.params.id);
            if (oldAbout && oldAbout.images) {
                oldAbout.images.forEach(img => {
                    if (img.startsWith('/uploads/') || img.startsWith('/api/uploads/')) {
                        const imagePath = path.join(__dirname, '../../', img.replace('/api/uploads/', '/uploads/'));
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    }
                });
            }
        }

        const about = await About.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!about) {
            res.status(404).json({ success: false, message: 'About section not found' });
            return;
        }

        res.json({
            success: true,
            message: 'About section updated successfully',
            data: about,
        });
    } catch (error: any) {
        console.error('Update about section error:', error);
        const errorMessage = error.errors
            ? Object.values(error.errors).map((e: any) => e.message).join(', ')
            : error.message || 'Failed to update about section';
        res.status(500).json({ success: false, message: errorMessage });
    }
};

export const deleteAboutSection = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const about = await About.findByIdAndDelete(req.params.id);

        if (!about) {
            res.status(404).json({ success: false, message: 'About section not found' });
            return;
        }

        if (about.images && about.images.length > 0) {
            about.images.forEach(img => {
                if (img.startsWith('/uploads/')) {
                    const imagePath = path.join(__dirname, '../../', img);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
            });
        }

        res.json({
            success: true,
            message: 'About section deleted successfully',
        });
    } catch (error) {
        console.error('Delete about section error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete about section' });
    }
};

