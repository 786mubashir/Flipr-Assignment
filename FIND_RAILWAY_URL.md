# How to Find Your Railway Backend URL

After deploying your backend to Railway, here's where to find your URL:

## Method 1: Service Overview (Easiest)

1. **Log in to Railway**: https://railway.app
2. **Click on your project** (the one you just created)
3. **Click on your service** (should be named after your repo or "backend")
4. **Look at the top of the page** - You'll see:
   ```
   🔗 Public Domain
   https://your-app-name.up.railway.app
   ```
   - This is your backend URL! ✅

## Method 2: Settings Tab

1. In your Railway project, click on your service
2. Go to the **"Settings"** tab
3. Scroll down to **"Networking"** section
4. Look for **"Public Domain"** or **"Generate Domain"**
5. Copy the URL shown (e.g., `https://xxx.up.railway.app`)

## Method 3: Deployments Tab

1. Click on your service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. In the deployment logs/details, you'll see the domain/URL

## What Your URL Will Look Like

Railway URLs typically follow this pattern:
- `https://your-project-production.up.railway.app`
- `https://random-words-1234.up.railway.app`

## Important Notes

- ⚠️ Your backend URL should **NOT** include `/api` in it
- ✅ Use the base URL: `https://xxx.up.railway.app`
- ✅ For frontend environment variable, use: `https://xxx.up.railway.app/api`

## Example

If your Railway backend URL is:
```
https://portfolio-backend-production.up.railway.app
```

Then in Vercel (frontend), use:
```
VITE_API_URL=https://portfolio-backend-production.up.railway.app/api
```

And in Railway backend CORS setting, use:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## Still Can't Find It?

1. Make sure your deployment completed successfully (green checkmark)
2. Check that your service is running (should show "Deployed" status)
3. If no domain is shown, Railway might need a moment to generate it
4. Try refreshing the page

## Test Your Backend URL

Once you have your URL, test it by visiting in your browser:
```
https://your-backend-url.up.railway.app/api/projects
```

You should see either:
- `[]` (empty array) - ✅ Working!
- JSON data - ✅ Working!
- Error message - Check your MongoDB connection and environment variables

