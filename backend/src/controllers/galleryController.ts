import { Response } from 'express';
import Gallery from '../models/Gallery';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const getAllGalleryItems = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const galleryItems = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            data: galleryItems,
            count: galleryItems.length,
        });
    } catch (error) {
        console.error('Get gallery items error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch gallery items' });
    }
};

export const getGalleryItemById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);

        if (!galleryItem) {
            res.status(404).json({ success: false, message: 'Gallery item not found' });
            return;
        }

        res.json({
            success: true,
            data: galleryItem,
        });
    } catch (error) {
        console.error('Get gallery item error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch gallery item' });
    }
};

export const createGalleryItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const galleryData = {
            ...req.body,
            imageUrl: req.file ? `/api/uploads/${req.file.filename}` : req.body.imageUrl,
        };

        const galleryItem = await Gallery.create(galleryData);

        res.status(201).json({
            success: true,
            message: 'Gallery item created successfully',
            data: galleryItem,
        });
    } catch (error) {
        console.error('Create gallery item error:', error);
        res.status(500).json({ success: false, message: 'Failed to create gallery item' });
    }
};

export const updateGalleryItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const updateData = {
            ...req.body,
            ...(req.file && { imageUrl: `/api/uploads/${req.file.filename}` }),
        };

        if (req.file) {
            const oldItem = await Gallery.findById(req.params.id);
            if (oldItem && oldItem.imageUrl && (oldItem.imageUrl.startsWith('/uploads/') || oldItem.imageUrl.startsWith('/api/uploads/'))) {
                const imagePath = oldItem.imageUrl.replace('/api/uploads/', '/uploads/');
                const oldImagePath = path.join(__dirname, '../../', imagePath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const galleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!galleryItem) {
            res.status(404).json({ success: false, message: 'Gallery item not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Gallery item updated successfully',
            data: galleryItem,
        });
    } catch (error) {
        console.error('Update gallery item error:', error);
        res.status(500).json({ success: false, message: 'Failed to update gallery item' });
    }
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const galleryItem = await Gallery.findByIdAndDelete(req.params.id);

        if (!galleryItem) {
            res.status(404).json({ success: false, message: 'Gallery item not found' });
            return;
        }

        if (galleryItem.imageUrl && (galleryItem.imageUrl.startsWith('/uploads/') || galleryItem.imageUrl.startsWith('/api/uploads/'))) {
            const imagePath = galleryItem.imageUrl.replace('/api/uploads/', '/uploads/');
            const filePath = path.join(__dirname, '../../', imagePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({
            success: true,
            message: 'Gallery item deleted successfully',
        });
    } catch (error) {
        console.error('Delete gallery item error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete gallery item' });
    }
};

