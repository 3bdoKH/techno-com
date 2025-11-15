import { Router } from 'express';
import authRoutes from './authRoutes';
import heroRoutes from './heroRoutes';
import aboutRoutes from './aboutRoutes';
import eventRoutes from './eventRoutes';
import galleryRoutes from './galleryRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/hero', heroRoutes);
router.use('/about', aboutRoutes);
router.use('/events', eventRoutes);
router.use('/gallery', galleryRoutes);

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;

