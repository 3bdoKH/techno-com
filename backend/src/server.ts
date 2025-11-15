import { config } from './config/env';
import { connectDatabase } from './config/database';
import app from './app';

const PORT = config.port;

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

startServer();

