# 🚀 TARIGYM Deployment Guide - Render.com

## Deploy on Render (FREE) - Single Service

### Everything in ONE Place!

### Step 1: Setup MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a **FREE cluster** (M0 Sandbox)
4. Click **Connect** → **Connect your application**
5. Copy connection string (looks like): 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tarigym
   ```
6. Replace `<password>` with your actual password
7. Save this - you'll need it!

### Step 2: Deploy on Render (ONE Service)

1. Go to https://render.com and sign in with GitHub
2. Click **New +** → **Web Service**
3. Connect your repository: `RamNarayan22/Tarigym-Apollo-University`
4. Configure:
   - **Name**: `tarigym`
   - **Root Directory**: (leave blank - use root)
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add Environment Variables:
   - `MONGO_URI` = (your MongoDB Atlas connection string)
   - `JWT_SECRET` = `tarigym-secret-key-2024`
   - `NODE_ENV` = `production`
6. Click **Create Web Service**
7. Wait 10 minutes for deployment
8. Your app will be live at ONE URL! (e.g., `https://tarigym.onrender.com`)

### Step 3: Access Your App

Your app is now live at ONE URL:
- Frontend: `https://tarigym.onrender.com`
- Backend API: `https://tarigym.onrender.com/api`

### Step 4: Login

Login with default credentials:
- Username: `admin`
- Password: `admin123`

---

## Alternative: Railway.app (Also Free)

1. Go to https://railway.app
2. Sign in with GitHub
3. **New Project** → **Deploy from GitHub**
4. Select your repo
5. Add MongoDB service
6. Deploy!

---

## Alternative: Single Deployment on Render

If you want ONE URL for everything:

1. Build React into server:
   ```bash
   cd client && npm run build
   cp -r build ../server/public
   ```

2. Deploy only the server folder
3. Access everything at one URL!

---

## Environment Variables Needed:

**Backend:**
- `MONGO_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Auto-generated or set to: `tarigym-secret-2024`
- `PORT` - `5001` (Render sets automatically)

**Frontend:**
- `REACT_APP_API_URL` - Your backend URL

---

## 📌 Default Credentials
- Username: `admin`
- Password: `admin123`

⚠️ **Change these after first login!**
