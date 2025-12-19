# Quick Start Guide

Follow these steps to get the application running locally.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## Step 1: Clone and Setup

1. Clone the repository (if using Git)
2. Open terminal/command prompt

## Step 2: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
```

4. Replace `MONGODB_URI` with your MongoDB connection string:
   - For MongoDB Atlas: Get connection string from your cluster
   - For local MongoDB: Use `mongodb://localhost:27017/portfolio`

5. Create uploads directory (if it doesn't exist):
```bash
mkdir uploads
```

6. Start the backend server:
```bash
npm run dev
```

Backend should be running on `http://localhost:5000`

## Step 3: Frontend Setup

1. Open a new terminal/command prompt

2. Navigate to frontend folder:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. (Optional) Create `.env` file in the `frontend` folder if you need to change API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

Frontend should be running on `http://localhost:5173`

## Step 4: Access the Application

1. **Landing Page**: Open browser and go to `http://localhost:5173`
2. **Admin Panel**: Go to `http://localhost:5173/admin`

## Step 5: Test the Application

### Landing Page
- View projects section (if any projects exist)
- View clients section (if any clients exist)
- Submit contact form
- Subscribe to newsletter

### Admin Panel
1. Go to Admin Panel (`http://localhost:5173/admin`)
2. **Add a Project**:
   - Click "Projects" tab
   - Click "+ Add Project"
   - Fill in details and upload an image
   - Image will be automatically cropped to 450x350
   - Click "Add Project"

3. **Add a Client**:
   - Click "Clients" tab
   - Click "+ Add Client"
   - Fill in details and upload an image
   - Image will be automatically cropped to 450x350
   - Click "Add Client"

4. **View Contacts**: Check "Contact Forms" tab to see submissions
5. **View Newsletter Subscriptions**: Check "Newsletter Subscriptions" tab

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
- Verify your MongoDB connection string is correct
- Check if MongoDB Atlas IP whitelist includes your IP (or use `0.0.0.0/0` for development)
- Ensure MongoDB credentials are correct

**Port Already in Use**:
- Change PORT in `.env` file to a different port (e.g., 5001)
- Update frontend `VITE_API_URL` accordingly

**Module Not Found**:
- Run `npm install` again in backend folder
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Frontend Issues

**Cannot Connect to Backend**:
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env` file
- Check browser console for CORS errors

**Build Errors**:
- Run `npm install` again in frontend folder
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### Image Upload Issues

**Image Not Uploading**:
- Check that `backend/uploads` directory exists
- Verify file permissions on uploads directory
- Check backend console for errors

**Image Not Displaying**:
- Verify backend is serving static files correctly
- Check image path in database
- Check browser console for 404 errors

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Add more projects and clients through the admin panel
- Customize the design and styling as needed
