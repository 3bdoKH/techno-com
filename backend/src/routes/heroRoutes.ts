import { Router } from 'express';
import { body } from 'express-validator';
import * as heroController from '../controllers/heroController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upload } from '../config/multer';

const router = Router();

router.get('/active', heroController.getActiveHero);

router.get('/', authenticateToken, heroController.getAllHeroes);
router.get('/:id', authenticateToken, heroController.getHeroById);

router.post(
    '/',
    authenticateToken,
    upload.single('backgroundImage'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('subtitle').notEmpty().withMessage('Subtitle is required'),
        validateRequest,
    ],
    heroController.createHero
);

router.put('/:id', authenticateToken, upload.single('backgroundImage'), heroController.updateHero);
router.delete('/:id', authenticateToken, heroController.deleteHero);
router.patch('/:id/toggle-active', authenticateToken, heroController.toggleHeroActive);

export default router;

