import { Response } from 'express';
import Hero from '../models/Hero';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const getAllHeroes = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const heroes = await Hero.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: heroes,
            count: heroes.length,
        });
    } catch (error) {
        console.error('Get heroes error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch heroes' });
    }
};

export const getHeroById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hero = await Hero.findById(req.params.id);

        if (!hero) {
            res.status(404).json({ success: false, message: 'Hero not found' });
            return;
        }

        res.json({
            success: true,
            data: hero,
        });
    } catch (error) {
        console.error('Get hero error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch hero' });
    }
};

export const getActiveHero = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hero = await Hero.findOne({ isActive: true }).sort({ createdAt: -1 });

        if (!hero) {
            res.status(404).json({ success: false, message: 'No active hero found' });
            return;
        }

        res.json({
            success: true,
            data: hero,
        });
    } catch (error) {
        console.error('Get active hero error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch active hero' });
    }
};

export const createHero = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const heroData = {
            ...req.body,
            backgroundImage: req.file ? `/api/uploads/${req.file.filename}` : req.body.backgroundImage,
        };

        const hero = await Hero.create(heroData);

        res.status(201).json({
            success: true,
            message: 'Hero created successfully',
            data: hero,
        });
    } catch (error) {
        console.error('Create hero error:', error);
        res.status(500).json({ success: false, message: 'Failed to create hero' });
    }
};

export const updateHero = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const updateData = {
            ...req.body,
            ...(req.file && { backgroundImage: `/api/uploads/${req.file.filename}` }),
        };

        if (req.file) {
            const oldHero = await Hero.findById(req.params.id);
            if (oldHero && oldHero.backgroundImage && (oldHero.backgroundImage.startsWith('/uploads/') || oldHero.backgroundImage.startsWith('/api/uploads/'))) {
                const imagePath = oldHero.backgroundImage.replace('/api/uploads/', '/uploads/');
                const oldImagePath = path.join(__dirname, '../../', imagePath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const hero = await Hero.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!hero) {
            res.status(404).json({ success: false, message: 'Hero not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Hero updated successfully',
            data: hero,
        });
    } catch (error) {
        console.error('Update hero error:', error);
        res.status(500).json({ success: false, message: 'Failed to update hero' });
    }
};

export const deleteHero = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hero = await Hero.findByIdAndDelete(req.params.id);

        if (!hero) {
            res.status(404).json({ success: false, message: 'Hero not found' });
            return;
        }

        if (hero.backgroundImage && (hero.backgroundImage.startsWith('/uploads/') || hero.backgroundImage.startsWith('/api/uploads/'))) {
            const imagePath = hero.backgroundImage.replace('/api/uploads/', '/uploads/');
            const filePath = path.join(__dirname, '../../', imagePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({
            success: true,
            message: 'Hero deleted successfully',
        });
    } catch (error) {
        console.error('Delete hero error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete hero' });
    }
};

export const toggleHeroActive = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hero = await Hero.findById(req.params.id);

        if (!hero) {
            res.status(404).json({ success: false, message: 'Hero not found' });
            return;
        }

        hero.isActive = !hero.isActive;
        await hero.save();

        res.json({
            success: true,
            message: `Hero ${hero.isActive ? 'activated' : 'deactivated'} successfully`,
            data: hero,
        });
    } catch (error) {
        console.error('Toggle hero error:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle hero status' });
    }
};

