# STEP-BY-STEP: Fix Your Hosted App

## 🚨 Main Issue
Your hosted frontend can't connect because it's trying to reach `localhost:8000` which doesn't exist in production.

## ✅ Quick Fix (3 Steps)

### Step 1: Deploy Backend to Render

1. Go to https://render.com and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your `SkillRoute` repository
4. Configure:
   - **Name**: `skillroute-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   
5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   PROJECT_NAME = SkillRoute
   ENV = production
   OPENAI_API_KEY = your_openai_api_key
   FIREBASE_PROJECT_ID = your_firebase_project_id
   FIREBASE_PRIVATE_KEY = your_firebase_private_key_with_newlines
   FIREBASE_CLIENT_EMAIL = your_firebase_client_email
   ```

6. Click "Create Web Service"
7. **Copy the URL** (e.g., `https://skillroute-backend.onrender.com`)

### Step 2: Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

   ```
   VITE_API_URL = https://skillroute-backend.onrender.com  (use YOUR backend URL)
   
   VITE_FIREBASE_API_KEY = (copy from frontend/.env.local)
   VITE_FIREBASE_AUTH_DOMAIN = (copy from frontend/.env.local)
   VITE_FIREBASE_PROJECT_ID = (copy from frontend/.env.local)
   VITE_FIREBASE_STORAGE_BUCKET = (copy from frontend/.env.local)
   VITE_FIREBASE_MESSAGING_SENDER_ID = (copy from frontend/.env.local)
   VITE_FIREBASE_APP_ID = (copy from frontend/.env.local)
   ```

5. Make sure to select "Production", "Preview", and "Development" for all variables

### Step 3: Redeploy

1. In Vercel, go to your project
2. Click "Deployments" tab
3. Click the three dots (•••) on the latest deployment
4. Click "Redeploy"
5. Check "Use existing Build Cache" is OFF
6. Click "Redeploy"

## 🧪 Test It

After redeployment completes (1-2 minutes):

1. Visit your Vercel URL
2. Open browser console (F12)
3. Try to save profile
4. Check Network tab - should see:
   - ✅ POST to `https://skillroute-backend.onrender.com/api/students/profile`
   - ❌ NOT to `localhost:8000`

## 📋 Quick Checklist

- [ ] Backend deployed to Render and showing "Live"
- [ ] Backend URL copied (looks like `https://something.onrender.com`)
- [ ] Tested backend health: visit `your-backend-url/` - should show JSON with "status: running"
- [ ] All environment variables added to Vercel
- [ ] `VITE_API_URL` points to your Render backend URL (not localhost)
- [ ] Frontend redeployed in Vercel
- [ ] Tested the app - profile save works
- [ ] Added Vercel domain to Firebase Console → Authentication → Authorized Domains

## 🐛 Still Not Working?

### If backend shows 502/503:
- Render free tier sleeps after 15 mins of inactivity
- First request takes 30-60 seconds to wake up
- Just wait and refresh

### If you see CORS errors:
Your backend CORS is already configured for `*.vercel.app`, so this should work!

### If Firebase auth fails:
1. Go to Firebase Console
2. Authentication → Settings → Authorized Domains
3. Add your Vercel domain (e.g., `your-app.vercel.app`)

## 💰 Cost
Both Render (backend) and Vercel (frontend) are **FREE** for this project!

---

## Alternative: Keep Backend Local (Testing Only)

If you just want to test locally while hosted version deploys:

1. Run backend locally: `cd backend && python -m uvicorn app.main:app --reload`
2. Use ngrok to expose it: `ngrok http 8000`
3. Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Update Vercel env: `VITE_API_URL = https://abc123.ngrok.io`
5. Redeploy

⚠️ **Warning**: ngrok URLs change every time you restart, not recommended for production.
