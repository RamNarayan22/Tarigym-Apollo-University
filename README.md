# 🏋️ TARIGYM - Apollo University Poster Competition

A full-stack MERN application for managing poster competitions at Apollo University with Admin and Judge roles.

## Features

### 👨‍💼 Admin Panel
- ✅ Secure login
- ✅ Create judge accounts with credentials
- ✅ Upload posters with images, titles, and descriptions
- ✅ Assign posters to specific judges
- ✅ View all judges and their assigned posters
- ✅ View scores and reports for each poster

### ⚖️ Judge Panel
- ✅ Secure login with Admin-created credentials
- ✅ View only assigned posters
- ✅ Score posters with marks (0-100) and comments
- ✅ Update scores after submission

## Tech Stack
- **MongoDB** - Database
- **Express.js** - Backend framework
- **React.js** - Frontend framework
- **Node.js** - Runtime environment
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/poster-competition
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

Start the backend:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

The React app will open at `http://localhost:3000`

## Default Admin Credentials
**Username:** `admin`  
**Password:** `admin123`

⚠️ **Change these credentials in production!**

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Admin Routes (require admin role)
- `POST /api/admin/judges` - Create judge
- `GET /api/admin/judges` - Get all judges
- `POST /api/admin/posters` - Upload poster
- `GET /api/admin/posters` - Get all posters
- `POST /api/admin/assign` - Assign poster to judge
- `GET /api/admin/scores` - Get all scores
- `GET /api/admin/scores/:posterId` - Get poster scores

### Judge Routes (require judge role)
- `GET /api/judge/posters` - Get assigned posters
- `POST /api/judge/score` - Submit/update score

## Project Structure
```
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── judgeController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Poster.js
│   │   ├── Score.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── judgeRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminDashboard.css
    │   │   ├── JudgeDashboard.js
    │   │   ├── JudgeDashboard.css
    │   │   ├── Login.js
    │   │   └── Login.css
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## Usage Flow

1. **Admin Login** - Use default credentials
2. **Create Judges** - Admin creates judge accounts
3. **Upload Posters** - Admin uploads competition posters
4. **Assign Posters** - Admin assigns posters to judges
5. **Judge Login** - Judges login with their credentials
6. **Score Posters** - Judges view and score assigned posters
7. **View Results** - Admin views all scores and reports

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- File upload validation

## Notes
- Images are stored locally in `server/uploads/`
- For production, consider using cloud storage (Cloudinary, AWS S3)
- Marks range: 0-100
- Judges can update their scores multiple times
- One judge can score a poster only once (can update later)

---

Built with ❤️ using the MERN stack
