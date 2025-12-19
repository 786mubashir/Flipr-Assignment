# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image storage in your application.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Fill in your details and create an account
4. You'll get a free tier with:
   - 25 GB storage
   - 25 GB monthly bandwidth
   - Transformations and optimizations

## Step 2: Get Your Cloudinary Credentials

After signing up, you'll be taken to your dashboard. You'll see:

1. **Cloud Name** - Your cloud name (e.g., `dabc123`)
2. **API Key** - Your API key (e.g., `123456789012345`)
3. **API Secret** - Your API secret (e.g., `abcdefghijklmnopqrstuvwxyz`)

⚠️ **Important**: Keep your API Secret secure! Never commit it to Git.

## Step 3: Configure Environment Variables

### Local Development

Add these to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the values with your actual Cloudinary credentials.

### Production (Railway/Render/etc.)

Add these environment variables in your deployment platform:

1. Go to your service settings
2. Navigate to Environment Variables
3. Add these three variables:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Step 4: Install Dependencies

The Cloudinary package is already added to `package.json`. Just run:

```bash
cd backend
npm install
```

## Step 5: Test the Integration

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Try uploading an image through the admin panel
3. Check Cloudinary dashboard → Media Library
4. You should see your uploaded images in folders:
   - `portfolio/projects/` - Project images
   - `portfolio/clients/` - Client images

## How It Works

### Image Upload Flow

1. **User uploads image** → Admin panel
2. **Image is cropped** → Sharp library crops to 450x350
3. **Uploaded to Cloudinary** → Stored in cloud
4. **URL saved to database** → Cloudinary secure URL
5. **Temporary file deleted** → Cleaned up from server

### Image Storage Structure

```
Cloudinary:
  └── portfolio/
      ├── projects/
      │   ├── cropped-image-1.jpg
      │   ├── cropped-image-2.jpg
      │   └── ...
      └── clients/
          ├── cropped-image-1.jpg
          ├── cropped-image-2.jpg
          └── ...
```

### Image URLs

Images stored in Cloudinary will have URLs like:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/portfolio/projects/cropped-image-1.jpg
```

These URLs are automatically stored in your database when you create/update projects or clients.

## Benefits of Using Cloudinary

✅ **No local storage needed** - Images stored in the cloud
✅ **CDN delivery** - Fast image delivery worldwide
✅ **Automatic optimizations** - Images optimized automatically
✅ **Transformations** - Can resize, crop, filter on-the-fly
✅ **Scalable** - Handles traffic spikes easily
✅ **Free tier** - Generous free tier for small projects

## Troubleshooting

### Error: "Invalid API Key"

- Check that `CLOUDINARY_API_KEY` is correct
- Make sure there are no extra spaces in your `.env` file
- Restart your server after changing `.env` file

### Error: "Invalid API Secret"

- Check that `CLOUDINARY_API_SECRET` is correct
- Verify the secret matches your API key
- Make sure it's set in your environment variables

### Images not uploading

1. Check Cloudinary credentials in `.env`
2. Check server logs for error messages
3. Verify Cloudinary account is active
4. Check free tier limits haven't been exceeded

### Old images still showing

- If you had images in `/uploads` folder, they won't be migrated automatically
- New uploads will go to Cloudinary
- Old local images will still work until you delete them

## Migration from Local Storage

If you have existing images in the `/uploads` folder:

1. Images will continue to work if they're already in the database
2. New uploads will automatically go to Cloudinary
3. To migrate existing images:
   - Download images from `/uploads`
   - Re-upload them through the admin panel
   - They'll be stored in Cloudinary

## Security Best Practices

1. ✅ Never commit `.env` file to Git (already in `.gitignore`)
2. ✅ Use environment variables in production
3. ✅ Don't share your API Secret publicly
4. ✅ Use Cloudinary's signed URLs for private images (optional)
5. ✅ Set up resource limits in Cloudinary dashboard

## Cloudinary Dashboard Features

Visit your Cloudinary dashboard to:
- View all uploaded images
- Monitor storage usage
- Set up auto-backup
- Configure security settings
- Set up webhooks (optional)

---

## Quick Reference

**Environment Variables Needed:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Where to get credentials:**
- Cloudinary Dashboard → Account Details

**Test upload:**
- Use admin panel → Add Project/Client → Upload image

