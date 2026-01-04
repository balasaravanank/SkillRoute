# Quick Fix: Hosted Frontend Connection Error

## Problem
Your hosted frontend is trying to connect to `localhost:8000` which doesn't exist in production.

## Solution

### Step 1: Deploy Your Backend First

You have two options:

#### Option A: Deploy to Render (Recommended - Free)

1. **Create Render Account**: Go to [render.com](https://render.com) and sign up
2. **Connect GitHub**: Link your GitHub repository
3. **Create New Web Service**: 
   - Select your `SkillRoute` repository
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables** in Render Dashboard:
   ```
   OPENAI_API_KEY=your_openai_key
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   PROJECT_NAME=SkillRoute
   ENV=production
   ```
5. **Copy your backend URL** (e.g., `https://skillroute-backend.onrender.com`)

#### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select backend folder
4. Add same environment variables
5. Copy the generated URL

### Step 2: Update Frontend Environment Variables

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add/Update: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Add all Firebase variables (copy from `.env.local`)

2. **Or update `.env.production` file** (already created):
   ```bash
   # Edit this file:
   frontend/.env.production
   
   # Change this line:
   VITE_API_URL=https://your-actual-backend-url.onrender.com
   ```

### Step 3: Redeploy Frontend

In Vercel:
1. Go to your project
2. Click "Redeploy" or push to main branch
3. Vercel will automatically redeploy with new environment variables

### Step 4: Update CORS in Backend

Make sure your backend allows your Vercel domain:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.vercel.app",  # Already configured ✓
        "https://your-actual-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Quick Test Locally

Before deploying, test locally:

```powershell
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` and try saving profile.

## Checking Deployment Status

### Backend Health Check
Visit: `https://your-backend-url.onrender.com/`
Should return:
```json
{
  "app": "SkillRoute",
  "env": "production",
  "status": "running"
}
```

### Frontend Check
Open browser console (F12) and check:
- Network tab shows API calls going to production URL (not localhost)
- No CORS errors
- Successful responses from backend

## Common Issues

### Issue: Still seeing localhost:8000
**Solution**: Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue: CORS error
**Solution**: Make sure your Vercel URL is in backend's allowed origins

### Issue: 502 Bad Gateway
**Solution**: Backend might be sleeping (Render free tier). Wait 30 seconds and retry.

### Issue: Firebase Auth not working
**Solution**: Add your Vercel domain to Firebase Console > Authentication > Settings > Authorized Domains

## Environment Variables Checklist

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Backend URL
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

### Backend (Render)
- [ ] `OPENAI_API_KEY`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_PRIVATE_KEY`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `PROJECT_NAME`
- [ ] `ENV`

## Need Help?

If you still see errors, provide:
1. Your backend URL
2. Your frontend URL
3. Error from browser console
4. Error from backend logs (in Render dashboard)
