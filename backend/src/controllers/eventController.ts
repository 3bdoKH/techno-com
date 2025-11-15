import { Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category, featured } = req.query;
        const filter: any = {};

        if (category) filter.category = category;
        if (featured) filter.featured = featured === 'true';

        const events = await Event.find(filter).sort({ date: -1 });

        res.json({
            success: true,
            data: events,
            count: events.length,
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
};

export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch event' });
    }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const images = req.files ? (req.files as Express.Multer.File[]).map(file => `/api/uploads/${file.filename}`) : [];

        const eventData = {
            ...req.body,
            images: images.length > 0 ? images : req.body.images || [],
        };

        const event = await Event.create(eventData);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ success: false, message: 'Failed to create event' });
    }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const newImages = req.files ? (req.files as Express.Multer.File[]).map(file => `/api/uploads/${file.filename}`) : [];

        const updateData = {
            ...req.body,
            ...(newImages.length > 0 && { images: newImages }),
        };

        if (newImages.length > 0) {
            const oldEvent = await Event.findById(req.params.id);
            if (oldEvent && oldEvent.images) {
                oldEvent.images.forEach(img => {
                    if (img.startsWith('/uploads/') || img.startsWith('/api/uploads/')) {
                        const imagePath = path.join(__dirname, '../../', img.replace('/api/uploads/', '/uploads/'));
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    }
                });
            }
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event,
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ success: false, message: 'Failed to update event' });
    }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }

        if (event.images && event.images.length > 0) {
            event.images.forEach(img => {
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
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
};

export const toggleEventFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }

        event.featured = !event.featured;
        await event.save();

        res.json({
            success: true,
            message: `Event ${event.featured ? 'featured' : 'unfeatured'} successfully`,
            data: event,
        });
    } catch (error) {
        console.error('Toggle event featured error:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle event featured status' });
    }
};

