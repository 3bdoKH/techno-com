import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files under /api/uploads
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', routes);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Commerce Admin Dashboard API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            hero: '/api/hero',
            about: '/api/about',
            events: '/api/events',
            gallery: '/api/gallery',
            content: '/api/content',
            health: '/api/health',
        },
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler
app.use(errorHandler);

export default app;

