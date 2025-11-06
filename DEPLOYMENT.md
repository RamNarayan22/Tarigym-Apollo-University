# 🚀 TARIGYM Deployment Guide - Render.com

## One-Click Deploy on Render (FREE)

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

### Step 2: Deploy on Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Blueprint**
4. Connect your repository: `RamNarayan22/Tarigym-Apollo-University`
5. Render will detect `render.yaml` automatically
6. Set environment variables:
   - `MONGO_URI`: (paste your MongoDB Atlas connection string)
   - `REACT_APP_API_URL`: `https://tarigym-backend.onrender.com`

7. Click **Apply** and wait 5-10 minutes for deployment

### Step 3: Create Admin Account

Once deployed, run this command to create admin:

```bash
curl -X POST https://tarigym-backend.onrender.com/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Your Live URLs:
- **Frontend**: https://tarigym-frontend.onrender.com
- **Backend API**: https://tarigym-backend.onrender.com

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
