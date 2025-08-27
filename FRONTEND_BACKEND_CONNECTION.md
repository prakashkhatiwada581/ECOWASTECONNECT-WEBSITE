# Frontend-Backend Connection Guide

## Overview

The EcoWasteConnect application now has a fully functional frontend-backend connection with real API integration.

## Connection Status ✅

- **Frontend**: React 18 with TypeScript running on Vite dev server
- **Backend**: Node.js/Express API server with MongoDB (optional)
- **API Layer**: RESTful API with JWT authentication
- **Demo Mode**: Works without database for development

## Demo Credentials

### User Login
- **Email**: `user@user.com`
- **Password**: `password123`
- **Access**: User dashboard, issue reporting, notifications

### Admin Login
- **Email**: `admin@admin.com`
- **Password**: `password123`
- **Access**: Admin dashboard, user management, all issues

## Features Connected

### ✅ Authentication
- Real JWT-based authentication
- Role-based access control (user/admin)
- Secure token storage
- Auto-login verification

### ✅ Issue Reporting
- Submit issues to backend API
- View user's submitted issues
- Real-time form validation
- Error handling and loading states

### ✅ Notifications
- Fetch notifications from API
- Mark notifications as read
- Role-based notification filtering

### ✅ Demo Mode
- Works without MongoDB connection
- In-memory data storage
- Sample data for testing
- Fallback for development

## API Endpoints Available

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Issues
- `GET /api/issues` - Get user's issues (or all for admin)
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `POST /api/notifications` - Create notification (admin)

### Health Check
- `GET /api/health` - Server status and database connection

## Technical Implementation

### Frontend API Layer (`client/lib/api.ts`)
- Centralized API configuration
- Automatic JWT token handling
- Error handling with custom ApiError class
- Response type safety with TypeScript

### Authentication Context (`client/contexts/AuthContext.tsx`)
- Real API integration for login/logout
- User state management
- Role-based access checking
- Loading and error states

### Issues Context (`client/contexts/IssuesContext.tsx`)
- Real API calls for CRUD operations
- Async form submission
- Data refresh capabilities
- Error handling

### Backend Demo Mode
- Automatic fallback when MongoDB unavailable
- In-memory user authentication
- Sample data generation
- Development-friendly setup

## Development Setup

1. **Start Backend**: `npm run dev:backend` (port 5000)
2. **Start Frontend**: `npm run dev:frontend` (port 8080)
3. **Both Together**: `npm run dev`

## Environment Variables

```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend (optional)
MONGODB_URI=mongodb://localhost:27017/ecowasteconnect
JWT_SECRET=your-secret-key
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based authorization
- CORS protection
- Rate limiting ready

## Testing the Connection

1. **Login**: Use the demo credentials to log in
2. **Submit Issue**: Try reporting a new issue
3. **View Issues**: Check your submitted issues in the dashboard
4. **Role Switching**: Test both user and admin roles
5. **API Health**: Check `/api/health` endpoint

## Production Deployment

For production deployment:

1. Set `MONGODB_URI` environment variable
2. Configure proper JWT secret
3. Update CORS origins
4. Enable database connection
5. Remove demo mode fallbacks

## Troubleshooting

### Backend Not Starting
- Check if port 5000 is available
- Verify Node.js version (16+)
- Check environment variables

### Frontend API Errors
- Verify VITE_API_URL points to backend
- Check network/CORS issues
- Verify backend is running

### Authentication Issues
- Clear localStorage and retry
- Check JWT token expiration
- Verify user credentials

## Next Steps

The foundation is now ready for:
- Database integration (MongoDB)
- Real user registration
- File upload capabilities
- Real-time features (WebSocket)
- Email notifications
- Advanced analytics
