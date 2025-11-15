import { Router } from 'express';
import { body } from 'express-validator';
import * as eventController from '../controllers/eventController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upload } from '../config/multer';

const router = Router();

router.get('/public', eventController.getPublicEvents);

router.get('/', authenticateToken, eventController.getAllEvents);
router.get('/:id', authenticateToken, eventController.getEventById);

router.post(
    '/',
    authenticateToken,
    upload.array('images', 10),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('date').isISO8601().withMessage('Valid date is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('category').notEmpty().withMessage('Category is required'),
        validateRequest,
    ],
    eventController.createEvent
);

router.put('/:id', authenticateToken, upload.array('images', 10), eventController.updateEvent);
router.delete('/:id', authenticateToken, eventController.deleteEvent);
router.patch('/:id/toggle-featured', authenticateToken, eventController.toggleEventFeatured);

export default router;

