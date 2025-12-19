# MongoDB Connection String Setup

Your MongoDB connection string has been provided. Follow these steps to set it up:

## Option 1: Manual Setup (Recommended)

1. Create a file named `.env` in the `backend` folder
2. Copy and paste the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://Flipr-db:ZgRkyE9EVcTUdEp3@fliprassignment.bnfesl7.mongodb.net/portfolio?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
```

**Important Notes:**
- The password has been extracted from the angle brackets you provided
- The database name `portfolio` has been added
- Connection options `?retryWrites=true&w=majority` have been added for better reliability

## Option 2: Using PowerShell/Command Prompt

### Windows PowerShell:
```powershell
cd "C:\Projects\Flipr Assignment\backend"
@"
PORT=5000
MONGODB_URI=mongodb+srv://Flipr-db:ZgRkyE9EVcTUdEp3@fliprassignment.bnfesl7.mongodb.net/portfolio?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
```

### Windows Command Prompt (CMD):
```cmd
cd "C:\Projects\Flipr Assignment\backend"
echo PORT=5000 > .env
echo MONGODB_URI=mongodb+srv://Flipr-db:ZgRkyE9EVcTUdEp3@fliprassignment.bnfesl7.mongodb.net/portfolio?retryWrites=true^&w=majority >> .env
echo CORS_ORIGIN=http://localhost:5173 >> .env
```

## MongoDB Atlas Configuration

**Before running the application, make sure:**

1. **IP Whitelist**: Your MongoDB Atlas cluster should allow connections from your IP address
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Either add your current IP or use `0.0.0.0/0` for development (less secure, but easier)

2. **Database User**: The user `Flipr-db` should have read/write permissions to the database

3. **Test Connection**: After setting up, you can test if the connection works by running:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## Verification

Once you've created the `.env` file, you should see:
- ✅ File exists at: `backend/.env`
- ✅ Server starts without MongoDB connection errors
- ✅ Console shows: "MongoDB Connected"

If you see connection errors, check:
- MongoDB Atlas IP whitelist includes your IP
- Username and password are correct
- Cluster is running and accessible

