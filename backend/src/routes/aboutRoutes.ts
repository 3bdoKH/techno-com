import { Router } from 'express';
import { body } from 'express-validator';
import * as aboutController from '../controllers/aboutController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upload } from '../config/multer';

const router = Router();

router.get('/public', aboutController.getActiveAboutSections);

router.get('/', authenticateToken, aboutController.getAllAboutSections);
router.get('/:id', authenticateToken, aboutController.getAboutById);

router.post(
    '/',
    authenticateToken,
    upload.array('images', 10),
    [
        body('section').notEmpty().withMessage('Section is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        validateRequest,
    ],
    aboutController.createAboutSection
);

router.put('/:id', authenticateToken, upload.array('images', 10), aboutController.updateAboutSection);
router.delete('/:id', authenticateToken, aboutController.deleteAboutSection);

export default router;

