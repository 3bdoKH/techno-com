import { Router } from 'express';
import { body } from 'express-validator';
import * as galleryController from '../controllers/galleryController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upload } from '../config/multer';

const router = Router();

router.get('/', authenticateToken, galleryController.getAllGalleryItems);
router.get('/:id', authenticateToken, galleryController.getGalleryItemById);

router.post(
    '/',
    authenticateToken,
    upload.single('imageUrl'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('category').notEmpty().withMessage('Category is required'),
        validateRequest,
    ],
    galleryController.createGalleryItem
);

router.put('/:id', authenticateToken, upload.single('imageUrl'), galleryController.updateGalleryItem);
router.delete('/:id', authenticateToken, galleryController.deleteGalleryItem);

export default router;

