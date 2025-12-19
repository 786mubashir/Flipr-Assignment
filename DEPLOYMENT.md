# Deployment Guide

This guide provides step-by-step instructions for deploying the Portfolio Application to various cloud platforms.

## Prerequisites

- MongoDB Atlas account (free tier recommended)
- Git repository for your code
- Account on your chosen deployment platform

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier M0)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`)
7. Replace `<password>` with your database user password
8. Save this connection string for later use

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI** (if not already installed)
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a Heroku app**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"
   heroku config:set PORT=5000
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name-backend
   git push heroku main
   ```

6. **Note**: Make sure to add `uploads` folder handling in Heroku (use a file storage service like AWS S3 for production)

### Option 2: Railway

1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository and choose the `backend` folder
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: Your frontend URL
   - `PORT`: 5000 (or let Railway set it automatically)
6. Railway will automatically deploy

### Option 3: Render

1. Go to [Render](https://render.com)
2. Sign up/Login
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `CORS_ORIGIN`
   - `PORT` (optional)
7. Deploy

### Option 4: AWS EC2

1. Launch an EC2 instance (Ubuntu recommended)
2. SSH into the instance
3. Install Node.js and npm
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Install PM2 (process manager)
   ```bash
   sudo npm install -g pm2
   ```
5. Clone your repository
   ```bash
   git clone your-repo-url
   cd "portfolio-app/backend"
   ```
6. Install dependencies
   ```bash
   npm install
   ```
7. Create `.env` file
   ```bash
   nano .env
   # Add your environment variables
   ```
8. Start with PM2
   ```bash
   pm2 start server.js --name portfolio-backend
   pm2 save
   pm2 startup
   ```
9. Configure security group to allow port 5000 (or your chosen port)

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)
7. Deploy

### Option 2: Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign up/Login
3. Click "New site from Git"
4. Connect your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL`: Your backend API URL
7. Deploy

### Option 3: GitHub Pages

1. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. Install gh-pages:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. Update `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: AWS S3 + CloudFront

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Create an S3 bucket
3. Enable static website hosting
4. Upload `dist` folder contents to S3
5. Create CloudFront distribution pointing to S3 bucket
6. Update environment variables as needed

## Environment Variables Summary

### Backend
- `MONGODB_URI`: MongoDB connection string
- `CORS_ORIGIN`: Frontend URL (e.g., `https://your-frontend.vercel.app`)
- `PORT`: Server port (usually set automatically by platform)

### Frontend
- `VITE_API_URL`: Backend API URL (e.g., `https://your-backend.herokuapp.com/api`)

## Important Notes

1. **File Storage**: For production, consider using cloud storage (AWS S3, Cloudinary) instead of local file system for images, as platforms like Heroku have ephemeral file systems.

2. **CORS**: Make sure to set `CORS_ORIGIN` in backend to match your frontend domain.

3. **Environment Variables**: Never commit `.env` files to Git. Use platform-specific environment variable configuration.

4. **HTTPS**: Always use HTTPS in production. Most platforms provide this by default.

5. **Database**: Use MongoDB Atlas free tier for development/testing, but consider upgrading for production.

## Testing After Deployment

1. Test backend endpoints using Postman or curl
2. Verify frontend can connect to backend
3. Test image upload functionality
4. Test all CRUD operations
5. Verify CORS is working correctly

## Troubleshooting

- **CORS errors**: Check that `CORS_ORIGIN` matches your frontend URL exactly
- **Database connection errors**: Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (or your server IP)
- **Image upload errors**: Check file permissions and storage location
- **Build errors**: Verify all dependencies are listed in `package.json`
