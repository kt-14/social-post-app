# Social Post Application - TaskPlanet Inspired Design

A vibrant, modern full-stack social media application inspired by TaskPlanet's UI design. Built with React.js, Node.js, Express, and MongoDB with Material-UI for a stunning, colorful interface.

## Features

### Core Features
- User authentication (signup and login)
- Create posts with text and/or images
- Like and unlike posts
- Comment on posts
- Follow button on posts
- Responsive design for all devices
- Real-time UI updates
- Pagination for efficient loading

## Tech Stack

### Frontend
- React.js 18
- Material-UI (MUI) 5
- React Router 6
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcryptjs for password hashing
- Multer for image uploads
- Express Validator for input validation

## Prerequisites

Before running this application, ensure you have:
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm (v6 or higher)

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in .env:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/social-post-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:3000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL in .env (optional):
```
VITE_API_URL=http://localhost:3000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The application will open at http://localhost:5000

## Project Structure

```
social-post-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── PostCard.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    ├── .gitignore
    └── package.json
```

## Design System

### Color Palette
- Primary Blue: #0D7EFF
- Secondary Orange: #FF6B35
- Success Green: #00D9A5
- Warning Yellow: #FFB800
- Error Red: #FF4757
- Background: #F5F7FA
- Text Primary: #2D3748
- Text Secondary: #718096

### Typography
- Font Family: Poppins, Segoe UI, Helvetica Neue
- Headings: 700 font weight
- Body Text: 400-600 font weight
- Buttons: 600-700 font weight

### Spacing and Layout
- Border Radius: 12-20px for UI elements
- Card Border Radius: 16px
- Button Border Radius: 12px
- Card Padding: 16-24px

### Shadows
- Light Shadow: 0 2px 8px rgba(0, 0, 0, 0.05)
- Medium Shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
- Heavy Shadow: 0 8px 20px rgba(0, 0, 0, 0.12)

## API Endpoints

### Authentication Endpoints

#### Signup
```
POST /api/auth/signup
Body: { username, email, password }
Response: { success, message, data: { id, username, email, token } }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, message, data: { id, username, email, token } }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: { id, username, email } }
```

### Post Endpoints

All post endpoints require authentication via JWT token in Authorization header.

#### Create Post
```
POST /api/posts
Headers: { Authorization: "Bearer <token>", Content-Type: "multipart/form-data" }
Body: FormData with content (text) and/or image (file)
Response: { success, message, data: post object }
```

#### Get All Posts
```
GET /api/posts?page=1&limit=10
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: [posts], pagination: { currentPage, totalPages, totalPosts, hasMore } }
```

#### Get Single Post
```
GET /api/posts/:id
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: post object }
```

#### Toggle Like
```
PUT /api/posts/:id/like
Headers: { Authorization: "Bearer <token>" }
Response: { success, message, data: updated post object }
```

#### Add Comment
```
POST /api/posts/:id/comment
Headers: { Authorization: "Bearer <token>" }
Body: { text: "comment text" }
Response: { success, message, data: updated post object }
```

#### Delete Post
```
DELETE /api/posts/:id
Headers: { Authorization: "Bearer <token>" }
Response: { success, message }
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required, 3-30 characters),
  email: String (unique, required, valid email format),
  password: String (hashed with bcrypt, required, min 6 characters),
  createdAt: Date,
  updatedAt: Date
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to Users collection),
  username: String,
  content: String (max 2000 characters),
  imageUrl: String,
  likes: [
    {
      user: ObjectId (reference to Users collection),
      username: String,
      createdAt: Date
    }
  ],
  comments: [
    {
      user: ObjectId (reference to Users collection),
      username: String,
      text: String (required, max 500 characters),
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Implementation

### Authentication Flow
1. User registers with username, email, and password
2. Password is hashed using bcryptjs before storing in database
3. JWT token is generated upon successful login or signup
4. Token is stored in browser's localStorage
5. Token is sent with each API request in Authorization header
6. Backend middleware verifies token before processing protected routes

### Post Creation
1. User can add text content, image, or both
2. At least one field (text or image) must be provided
3. Images are validated for type (jpeg, jpg, png, gif, webp) and size (max 5MB)
4. Files are stored in backend uploads directory
5. Post is saved to database with user reference and timestamp

### Like/Unlike Functionality
1. User clicks like button on a post
2. Backend checks if user has already liked the post
3. If already liked, the like is removed
4. If not liked, a new like is added
5. Updated post with new like count is returned
6. UI updates instantly without page refresh

### Comment System
1. User types comment and submits
2. Comment is validated (required, max 500 characters)
3. Comment is added to post's comments array with user info
4. Updated post with new comment is returned
5. UI updates to show new comment immediately

### Pagination
1. Frontend requests posts with page number and limit
2. Backend calculates skip value: (page - 1) * limit
3. Posts are fetched sorted by creation date (newest first)
4. Response includes pagination metadata
5. Frontend displays "Load More" button if more posts exist

## Security Features

- Password hashing with bcryptjs and salt rounds
- JWT tokens for stateless authentication
- Protected routes requiring valid authentication tokens
- Input validation using express-validator
- File upload restrictions (type and size limits)
- CORS configuration for cross-origin requests
- Authorization checks (users can only delete their own posts)

## Development

### Running in Development Mode

Backend with auto-reload:
```bash
cd backend
npm run dev
```

Frontend with hot-reload:
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend production build:
```bash
cd frontend
npm run build
```

This creates an optimized production build in the build folder.

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Ensure MongoDB is running on your system
- Check the connection string in .env file
- Verify MongoDB is listening on the correct port (default: 27017)

#### Port Already in Use
- Change PORT in backend .env file
- Kill the process using the port

#### CORS Errors
- Backend has CORS enabled by default
- Check if frontend is running on expected port

#### Image Upload Fails
- Ensure uploads directory exists in backend folder
- Check file size is under 5MB limit
- Verify file type is allowed (jpeg, jpg, png, gif, webp)

#### Authentication Issues
- Verify JWT_SECRET is set in backend .env
- Check token expiration time
- Clear localStorage and login again if token is corrupted

## License

This project is created for educational purposes as part of a full-stack internship assignment.

## Acknowledgments

- UI design inspired by TaskPlanet application
- Material-UI for the component library
- MongoDB for the database solution

---

Built with React.js, Node.js, Express.js, and MongoDB
