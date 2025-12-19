// Helper script to create .env file
// Run with: node setup-env.js

const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Skipping...');
  console.log('If you want to update it, please edit backend/.env manually.');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📍 Location: backend/.env');
  console.log('\n⚠️  Important: Make sure your MongoDB Atlas IP whitelist includes:');
  console.log('   - Your current IP address');
  console.log('   - Or use 0.0.0.0/0 for development (less secure)');
}

