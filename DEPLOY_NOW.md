# Quick Deployment Guide

This guide will help you deploy your application in the easiest way possible.

## Recommended Setup
- **Backend**: Railway (Easy, free tier available)
- **Frontend**: Vercel (Best for Vite/React, free tier)

---

## Step 1: Deploy Backend (Railway)

### Prerequisites
1. Make sure your MongoDB Atlas IP whitelist allows all IPs: `0.0.0.0/0`
2. Have your MongoDB connection string ready

### Deployment Steps

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will detect the repo
   - Click on the service
   - Go to "Settings" tab
   - Set **Root Directory** to: `backend`
   - Set **Start Command** to: `npm start`

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add these variables:
     ```
     MONGODB_URI=your-mongodb-connection-string-here
     CORS_ORIGIN=https://your-frontend-domain.vercel.app
     ```
   - Note: We'll update CORS_ORIGIN after frontend is deployed

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://your-app.up.railway.app`)

---

## Step 2: Deploy Frontend (Vercel)

### Deployment Steps

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)

4. **Add Environment Variable**
   - Go to "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Replace with your actual Railway backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://your-app.vercel.app`)

---

## Step 3: Update CORS Origin

1. **Go back to Railway**
   - Navigate to your backend service
   - Go to "Variables" tab
   - Update `CORS_ORIGIN` to your Vercel frontend URL:
     ```
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```
   - Railway will automatically redeploy

---

## Step 4: Test Your Deployment

1. **Test Backend**
   - Visit: `https://your-backend.railway.app/api/projects`
   - Should return: `[]` or projects array

2. **Test Frontend**
   - Visit: `https://your-frontend.vercel.app`
   - Should load the landing page
   - Try accessing admin panel: `/admin`

---

## Important Notes

### MongoDB Atlas Configuration
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs - necessary for cloud deployment)
3. Make sure your database user has read/write permissions

### File Uploads (Production Consideration)
- Current setup uses local file storage (`backend/uploads/`)
- Railway has ephemeral storage (files deleted on restart)
- For production, consider:
  - AWS S3
  - Cloudinary
  - Azure Blob Storage
  - Or use Railway's volume feature for persistent storage

### Environment Variables Summary

**Backend (Railway):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Alternative: Render (Another Easy Option)

### Backend on Render:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as Railway)

### Frontend on Render:
1. New → Static Site
2. Connect GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add environment variable: `VITE_API_URL`

---

## Troubleshooting

### Backend Issues
- **Connection Error**: Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- **CORS Error**: Verify CORS_ORIGIN matches frontend URL exactly
- **Port Error**: Railway/Render auto-sets PORT, don't override it

### Frontend Issues
- **API Connection Error**: Check VITE_API_URL is correct
- **Build Error**: Make sure Root Directory is set to `frontend`
- **404 on Routes**: Add `vercel.json` for SPA routing (see below)

### Add vercel.json for SPA Routing (if needed)

Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS_ORIGIN updated to frontend URL
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Frontend can fetch data from backend
- [ ] Admin panel accessible
- [ ] Contact form works
- [ ] Newsletter subscription works

---

## Your Deployment URLs

After deployment, note down:
- **Backend URL**: `https://________________.railway.app`
- **Frontend URL**: `https://________________.vercel.app`
- **MongoDB Connection**: Already configured ✅

