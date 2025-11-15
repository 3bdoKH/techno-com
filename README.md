# Commerce Admin Dashboard

## Project Overview

This is a monorepo containing a full-stack commerce administration dashboard application. The project consists of a Next.js frontend application and an Express.js backend API server. The application provides administrative functionality for managing hero sections, about content, events, and gallery items for a commerce website.

## Tech Stack

### Frontend

- Next.js 16.0.1
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Prettier
- Radix UI components

### Backend

- Node.js
- Express.js 4.18.2
- TypeScript 5.3.3
- MongoDB with Mongoose 8.0.3
- JWT authentication
- Multer for file uploads
- Express Validator for request validation
- Bcryptjs for password hashing
- Prettier

## Project Structure

```
commerce/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions and API client
│   ├── public/       # Static assets
│   ├── .prettierrc   # Prettier configuration
│   └── eslint.config.mjs  # ESLint configuration
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   ├── uploads/      # Uploaded files directory
│   └── .prettierrc   # Prettier configuration
└── README.md
```

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- MongoDB database (local or cloud instance)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd commerce
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/commerce
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
CORS_ORIGIN=http://localhost:3000
```

Build the TypeScript code:

```bash
npm run build
```

Start the development server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000` by default.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:3000` by default.

## Environment Variables

### Backend Environment Variables

| Variable       | Description               | Required | Default     |
| -------------- | ------------------------- | -------- | ----------- |
| PORT           | Server port number        | No       | 5000        |
| NODE_ENV       | Environment mode          | No       | development |
| MONGODB_URI    | MongoDB connection string | Yes      | -           |
| JWT_SECRET     | Secret key for JWT tokens | Yes      | -           |
| JWT_EXPIRES_IN | JWT token expiration time | No       | 7d          |
| ADMIN_EMAIL    | Default admin email       | Yes      | -           |
| ADMIN_PASSWORD | Default admin password    | Yes      | -           |
| CORS_ORIGIN    | Allowed CORS origin       | No       | \*          |

### Frontend Environment Variables

| Variable                | Description                 | Required | Default     |
| ----------------------- | --------------------------- | -------- | ----------- |
| NEXT_PUBLIC_API_URL     | Backend API base URL        | Yes      | -           |
| NEXT_PUBLIC_UPLOADS_URL | Base URL for uploaded files | Yes      | -           |
| NODE_ENV                | Environment mode            | No       | development |

## Available Scripts

### Backend Scripts

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start development server with hot reload      |
| `npm run build` | Compile TypeScript to JavaScript              |
| `npm start`     | Start production server                       |
| `npm run watch` | Watch TypeScript files and compile on changes |

### Frontend Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build production bundle  |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |

## API Endpoints

### Authentication

| Method | Endpoint                    | Description           | Auth Required |
| ------ | --------------------------- | --------------------- | ------------- |
| POST   | `/api/auth/login`           | Admin login           | No            |
| POST   | `/api/auth/register`        | Admin registration    | No            |
| GET    | `/api/auth/profile`         | Get admin profile     | Yes           |
| PUT    | `/api/auth/profile`         | Update admin profile  | Yes           |
| POST   | `/api/auth/change-password` | Change admin password | Yes           |

### Hero Section

| Method | Endpoint                      | Description               | Auth Required |
| ------ | ----------------------------- | ------------------------- | ------------- |
| GET    | `/api/hero/active`            | Get active hero section   | No            |
| GET    | `/api/hero`                   | Get all hero sections     | Yes           |
| GET    | `/api/hero/:id`               | Get hero section by ID    | Yes           |
| POST   | `/api/hero`                   | Create hero section       | Yes           |
| PUT    | `/api/hero/:id`               | Update hero section       | Yes           |
| DELETE | `/api/hero/:id`               | Delete hero section       | Yes           |
| PATCH  | `/api/hero/:id/toggle-active` | Toggle hero active status | Yes           |

### About Section

| Method | Endpoint            | Description               | Auth Required |
| ------ | ------------------- | ------------------------- | ------------- |
| GET    | `/api/about/public` | Get active about sections | No            |
| GET    | `/api/about`        | Get all about sections    | Yes           |
| GET    | `/api/about/:id`    | Get about section by ID   | Yes           |
| POST   | `/api/about`        | Create about section      | Yes           |
| PUT    | `/api/about/:id`    | Update about section      | Yes           |
| DELETE | `/api/about/:id`    | Delete about section      | Yes           |

### Events

| Method | Endpoint                          | Description                  | Auth Required |
| ------ | --------------------------------- | ---------------------------- | ------------- |
| GET    | `/api/events`                     | Get all events               | Yes           |
| GET    | `/api/events/:id`                 | Get event by ID              | Yes           |
| POST   | `/api/events`                     | Create event                 | Yes           |
| PUT    | `/api/events/:id`                 | Update event                 | Yes           |
| DELETE | `/api/events/:id`                 | Delete event                 | Yes           |
| PATCH  | `/api/events/:id/toggle-featured` | Toggle event featured status | Yes           |

### Gallery

| Method | Endpoint           | Description            | Auth Required |
| ------ | ------------------ | ---------------------- | ------------- |
| GET    | `/api/gallery`     | Get all gallery items  | Yes           |
| GET    | `/api/gallery/:id` | Get gallery item by ID | Yes           |
| POST   | `/api/gallery`     | Create gallery item    | Yes           |
| PUT    | `/api/gallery/:id` | Update gallery item    | Yes           |
| DELETE | `/api/gallery/:id` | Delete gallery item    | Yes           |

### Health Check

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/api/health` | Server health check | No            |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are stored in localStorage on the frontend and automatically included in API requests.

## File Uploads

File uploads are handled using Multer. Uploaded files are stored in the `backend/uploads` directory and served at `/api/uploads`. Supported file types and size limits are configured in the Multer configuration.

## Code Quality

### ESLint Configuration

The project uses ESLint for code quality. Configuration files:

- Frontend: `frontend/eslint.config.mjs`
- Backend: TypeScript compiler with strict mode enabled

### Prettier Configuration

The project uses Prettier for consistent code formatting. Configuration files:

- Frontend: `frontend/.prettierrc`
- Backend: `backend/.prettierrc`

To format code, run Prettier using your editor's format command or install Prettier globally and run `prettier --write` on the project directories.

## Deployment

### Backend Deployment

The backend can be deployed to platforms such as Render, Railway, or Fly.io.

1. Set environment variables in your deployment platform
2. Ensure MongoDB is accessible from the deployment environment
3. Build the project: `npm run build`
4. Start the server: `npm start`

For Render:

1. Connect your GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Configure environment variables
5. Deploy

### Frontend Deployment

The frontend can be deployed to Vercel, which provides excellent Next.js support.

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables
4. Deploy

For manual deployment:

1. Build the project: `npm run build`
2. Start the server: `npm start`

### Environment Variables for Production

Update the following environment variables for production:

Backend:

- Set `NODE_ENV=production`
- Use production MongoDB URI
- Use strong JWT secret
- Set appropriate CORS origin

Frontend:

- Set `NEXT_PUBLIC_API_URL` to production API URL
- Set `NEXT_PUBLIC_UPLOADS_URL` to production uploads URL
- Set `NODE_ENV=production`

## Database Schema

The application uses MongoDB with the following collections:

- Admin: User authentication and profile information
- Hero: Hero section content and images
- About: About section content and images
- Event: Event information, dates, locations, and images
- Gallery: Gallery items with images and metadata

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

Validation errors include detailed field-level error messages in the `errors` object.

## Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- CORS is configured to restrict origins
- Input validation is performed using express-validator
- File uploads are restricted by type and size

## License

This project is proprietary and confidential.
