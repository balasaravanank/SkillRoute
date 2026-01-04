# 🚀 SkillRoute Complete A-Z Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Preparation (Before Deployment)](#preparation)
3. [Backend Deployment (Render)](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing & Verification](#testing-verification)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance)

---

## Prerequisites

### ✅ Checklist - What You Need

- [ ] GitHub account ([Sign up here](https://github.com/signup))
- [ ] Render account ([Sign up here](https://render.com))
- [ ] Vercel account ([Sign up here](https://vercel.com))
- [ ] Firebase project already set up
- [ ] OpenAI API key
- [ ] Git installed on your computer
- [ ] Code pushed to GitHub ✅ (Already done!)

---

## Preparation (Before Deployment)

### Step 1: Verify Your Firebase Credentials

#### 1.1 Locate your Firebase key file
Check that you have: `backend/firebase_key.json`

#### 1.2 Open the file and note these values:
```json
{
  "project_id": "your-project-id",           // ← Copy this
  "private_key": "-----BEGIN PRIVATE...",    // ← Copy this
  "client_email": "firebase-adminsdk-..."    // ← Copy this
}
```

#### 1.3 Get Frontend Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" section
5. If no web app exists, click "Add app" → Web (</>) icon
6. Copy the `firebaseConfig` object:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Copy this
  authDomain: "xxx.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123:web:abc"
};
```

### Step 2: Verify Your OpenAI API Key

Check your file: `backend/.env`
```
OPENAI_API_KEY=sk-proj-...
```

**⚠️ Important**: Keep this key secret! Never commit it to GitHub.

---

## Backend Deployment (Render)

### Step 3: Create Account on Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Choose **"Sign up with GitHub"** (easiest option)
4. Authorize Render to access your GitHub repositories

### Step 4: Create a New Web Service

1. From Render Dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**

### Step 5: Connect Your Repository

1. You'll see a list of your GitHub repositories
2. Find **"skillroute"** (or whatever you named it)
3. Click **"Connect"**

**Can't see your repo?** 
- Click "Configure account" → GitHub settings
- Give Render access to the repository

### Step 6: Configure Web Service

Fill in these settings **exactly**:

```
Name: skillroute-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

**Screenshot of what it should look like:**
- ✅ Python selected as runtime
- ✅ Root Directory shows "backend"
- ✅ Build Command exactly as above
- ✅ Start Command exactly as above

### Step 7: Add Environment Variables (CRITICAL!)

Before clicking "Create Web Service", scroll down to **"Environment Variables"**

Click **"Add Environment Variable"** and add these **ONE BY ONE**:

#### Variable 1:
```
Key: PROJECT_NAME
Value: SkillRoute
```

#### Variable 2:
```
Key: ENV
Value: production
```

#### Variable 3:
```
Key: OPENAI_API_KEY
Value: sk-proj-[YOUR ACTUAL KEY FROM backend/.env]
```

#### Variable 4:
```
Key: FIREBASE_PROJECT_ID
Value: [From firebase_key.json - the "project_id" value]
```

#### Variable 5:
```
Key: FIREBASE_CLIENT_EMAIL
Value: [From firebase_key.json - the "client_email" value]
```

#### Variable 6 (The Tricky One!):
```
Key: FIREBASE_PRIVATE_KEY
Value: [From firebase_key.json - the "private_key" value]
```

**⚠️ IMPORTANT for FIREBASE_PRIVATE_KEY:**
- Copy the ENTIRE private key including:
  ```
  -----BEGIN PRIVATE KEY-----
  [all the lines]
  -----END PRIVATE KEY-----
  ```
- In Render, paste it AS IS (with actual line breaks)
- Or replace `\n` with actual Enter key presses

**Alternative Method (Easier):**
Instead of adding environment variables, you can upload `firebase_key.json` as a **Secret File**:
1. Scroll to "Secret Files" section
2. Click "Add Secret File"
3. Filename: `firebase_key.json`
4. Contents: Paste entire contents of your local `firebase_key.json`

### Step 8: Deploy Backend

1. Double-check all environment variables are set
2. Click **"Create Web Service"** button
3. Render will start building...

**What happens now:**
```
⏳ Initializing...
⏳ Installing dependencies...
⏳ Starting server...
✅ Live! (takes 3-5 minutes)
```

### Step 9: Get Your Backend URL

Once deployed:
1. Look at the top of your service page
2. You'll see: `https://skillroute-backend-xxxx.onrender.com`
3. **COPY THIS URL** - you'll need it for frontend!

### Step 10: Test Backend

Click the URL or visit: `https://skillroute-backend-xxxx.onrender.com/`

**Expected Response:**
```json
{
  "app": "SkillRoute",
  "env": "production",
  "status": "running"
}
```

**✅ If you see this - Backend is working!**

**🚨 Not working?** Jump to [Troubleshooting](#troubleshooting)

---

## Frontend Deployment (Vercel)

### Step 11: Create Account on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel

### Step 12: Import Your Project

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"skillroute"**
4. Click **"Import"**

### Step 13: Configure Project

You'll see the import screen. Configure these settings:

```
Framework Preset: Vite (should auto-detect)
Root Directory: frontend
Build Command: npm run build (default is fine)
Output Directory: dist (default is fine)
Install Command: npm install (default is fine)
```

**Before deploying**, click **"Environment Variables"**

### Step 14: Add Environment Variables

Click **"Environment Variables"** tab

Add these variables **ONE BY ONE** (from your Firebase config in Step 1.3):

#### Variable 1:
```
Name: VITE_FIREBASE_API_KEY
Value: AIza[your-actual-api-key]
Environment: All (Production, Preview, Development)
```

#### Variable 2:
```
Name: VITE_FIREBASE_AUTH_DOMAIN
Value: your-project.firebaseapp.com
Environment: All
```

#### Variable 3:
```
Name: VITE_FIREBASE_PROJECT_ID
Value: your-project-id
Environment: All
```

#### Variable 4:
```
Name: VITE_FIREBASE_STORAGE_BUCKET
Value: your-project.appspot.com
Environment: All
```

#### Variable 5:
```
Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789
Environment: All
```

#### Variable 6:
```
Name: VITE_FIREBASE_APP_ID
Value: 1:123456789:web:abcdef
Environment: All
```

#### Variable 7 (MOST IMPORTANT!):
```
Name: VITE_API_URL
Value: https://skillroute-backend-xxxx.onrender.com
       ↑ YOUR BACKEND URL FROM STEP 9
Environment: All
```

**⚠️ Critical**: Make sure `VITE_API_URL` has NO trailing slash!
- ✅ Correct: `https://skillroute-backend-xxxx.onrender.com`
- ❌ Wrong: `https://skillroute-backend-xxxx.onrender.com/`

### Step 15: Deploy Frontend

1. Verify all 7 environment variables are added
2. Click **"Deploy"**
3. Vercel will build your app (takes 1-3 minutes)

**Build Process:**
```
⏳ Building...
⏳ Optimizing assets...
⏳ Deploying...
✅ Ready! 🎉
```

### Step 16: Get Your Frontend URL

After deployment:
1. You'll see a success screen with confetti 🎉
2. Your URL will be: `https://skillroute-xxxx.vercel.app`
3. Click **"Visit"** to open your app

**🎉 Your app is now live!** (But not fully configured yet...)

---

## Post-Deployment Configuration

Your app is deployed but needs final configuration to work properly.

### Step 17: Update Backend CORS Settings

Your backend needs to allow requests from your Vercel domain.

#### 17.1 Get Your Exact Vercel URL
Copy your Vercel URL: `https://skillroute-xxxx.vercel.app`

#### 17.2 Update Backend Code

**Option A: Quick Update (Locally then push)**

1. Open: `backend/app/main.py`
2. Find the CORS middleware section (around line 14)
3. Update it to:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://skillroute-xxxx.vercel.app"  # ← Replace with YOUR Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. Save the file
5. Commit and push:
```bash
git add backend/app/main.py
git commit -m "Add production CORS origin"
git push origin main
```

6. Render will **automatically redeploy** (takes 2-3 minutes)

**Option B: Edit Directly on GitHub**
1. Go to your GitHub repository
2. Navigate to `backend/app/main.py`
3. Click the pencil icon (Edit)
4. Add your Vercel URL to the `allow_origins` list
5. Commit changes
6. Render auto-deploys

### Step 18: Configure Firebase Authentication

Your frontend needs to be authorized in Firebase.

#### 18.1 Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** (left sidebar)

#### 18.2 Enable Authentication Providers (if not already)
1. Click **Sign-in method** tab
2. Enable **Email/Password**
3. Enable **Google** (if you want Google sign-in)

#### 18.3 Add Authorized Domains
1. Scroll to **Authorized domains** section
2. Click **"Add domain"**
3. Enter: `skillroute-xxxx.vercel.app` (your Vercel domain)
4. Click **Add**

**Default authorized domains:**
- ✅ localhost (already there)
- ✅ your-project.firebaseapp.com (already there)
- ✅ skillroute-xxxx.vercel.app (you just added)

### Step 19: Update Firestore Security Rules (if needed)

If you're using Firestore, make sure your security rules are production-ready.

1. In Firebase Console → **Firestore Database**
2. Go to **Rules** tab
3. Make sure rules are NOT open to public:

**❌ BAD (Development only):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ← Too permissive!
    }
  }
}
```

**✅ GOOD (Production):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read, write: if request.auth != null && request.auth.uid == studentId;
    }
    match /progress/{progressId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

---

## Testing & Verification

### Step 20: Test Your Deployed Application

#### 20.1 Test Frontend
1. Visit your Vercel URL: `https://skillroute-xxxx.vercel.app`
2. You should see your landing page

#### 20.2 Test Backend API
1. Visit: `https://skillroute-backend-xxxx.onrender.com/docs`
2. You should see FastAPI interactive documentation

#### 20.3 Test Full Flow
1. On your frontend, click **Sign Up**
2. Create a new account with email/password
3. Fill in the profile form
4. Check if the data is saved

**Open Browser Console (F12) while testing:**
- ✅ No CORS errors
- ✅ API calls successful (status 200)
- ✅ Firebase authentication working

### Step 21: Verify Database

1. Go to Firebase Console → **Firestore Database**
2. Check if new documents appear in:
   - `students` collection
   - `progress` collection

✅ If you see data - Everything is working!

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ Issue 1: "CORS Error" in Browser Console

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
1. Check Step 17 - Update CORS settings in backend
2. Make sure your Vercel URL is in the `allow_origins` list
3. Make sure backend has redeployed after changes
4. Hard refresh browser: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

#### ❌ Issue 2: "Failed to fetch" or "Network Error"

**Error:** API calls failing

**Check:**
1. Is `VITE_API_URL` set correctly in Vercel? (Step 14)
2. No trailing slash in API URL?
3. Is backend actually running? Visit backend URL directly
4. Check Render logs for errors

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_API_URL` = `https://skillroute-backend-xxxx.onrender.com`
3. Redeploy: Deployments tab → Click "Redeploy"

#### ❌ Issue 3: Backend Shows "Application Failed"

**Check Render Logs:**
1. Go to Render Dashboard → Your service
2. Click **"Logs"** tab
3. Look for error messages

**Common causes:**
- Missing environment variables
- Wrong Firebase credentials
- Python package installation failed
- Wrong start command

**Fix:**
1. Verify all 6 environment variables in Step 7
2. Check `FIREBASE_PRIVATE_KEY` is complete (including BEGIN/END lines)
3. Redeploy: Manual Deploy → Deploy latest commit

#### ❌ Issue 4: "Firebase: Error (auth/unauthorized-domain)"

**Error:** Firebase authentication fails

**Solution:**
1. Follow Step 18.3 again
2. Make sure Vercel domain is in Firebase authorized domains
3. Wait 5 minutes for Firebase to update
4. Clear browser cache and try again

#### ❌ Issue 5: Backend is Slow (First Request)

**Symptom:** First API call takes 30-60 seconds

**Explanation:** Render's free tier puts services to sleep after 15 minutes of inactivity. First request wakes it up.

**Solutions:**
- **Free option**: Just wait, subsequent requests will be fast
- **Paid option**: Upgrade to Render's paid plan ($7/month) - no sleeping

#### ❌ Issue 6: "Internal Server Error" (500)

**Check:**
1. Render logs for the actual error
2. Common causes:
   - OpenAI API key invalid or no credits
   - Firebase credentials incorrect
   - Database connection failed

**Debug:**
1. Test backend endpoints individually in `/docs`
2. Check which endpoint fails
3. Look at Render logs for that specific endpoint

#### ❌ Issue 7: Build Failed on Vercel

**Error:** Build process fails

**Check:**
1. Are all environment variables added?
2. Root directory set to `frontend`?
3. Node version compatible?

**Fix:**
1. Go to Vercel → Settings → General
2. Node.js Version: 18.x (recommended)
3. Redeploy

#### ❌ Issue 8: Firebase Admin SDK Error

**Error:** `Could not load credential file` or `Invalid Firebase credentials`

**Solution for Render:**

Instead of environment variables, use Secret File:
1. Render Dashboard → Your service
2. Environment → Secret Files
3. Add Secret File:
   - Filename: `firebase_key.json`
   - Content: [paste entire firebase_key.json]
4. Update `backend/app/utils/firebase.py` if needed to look for file at `/etc/secrets/firebase_key.json`

---

## Maintenance & Updates

### How to Update Your App

#### Update Backend Code

1. Make changes locally in `backend/` folder
2. Test locally: `uvicorn app.main:app --reload`
3. Commit and push:
```bash
git add .
git commit -m "Update backend feature"
git push origin main
```
4. Render automatically deploys (watch in Render dashboard)

#### Update Frontend Code

1. Make changes locally in `frontend/` folder
2. Test locally: `npm run dev`
3. Commit and push:
```bash
git add .
git commit -m "Update frontend UI"
git push origin main
```
4. Vercel automatically deploys (watch in Vercel dashboard)

### Monitor Your App

#### Render Monitoring
- Dashboard → Your service → Metrics
- View: CPU usage, Memory, Response times
- Logs: Real-time logs of all requests

#### Vercel Analytics
- Dashboard → Your project → Analytics (Pro plan feature)
- Or use browser console to monitor errors

#### Firebase Monitoring
- Firebase Console → Usage
- Monitor: Authentication, Database reads/writes
- Free tier limits:
  - Firestore: 50K reads, 20K writes per day
  - Authentication: Unlimited
  - Storage: 1GB

### Backup Your Database

**Firestore Backup:**
1. Firebase Console → Firestore Database
2. Use Firebase CLI for automated backups
3. Or export data programmatically

### Cost Monitoring

**Current Free Tier Limits:**

| Service | Free Tier | What Happens When Exceeded |
|---------|-----------|----------------------------|
| **Render** | 750 hours/month | Service stops, need to upgrade |
| **Vercel** | 100GB bandwidth | Deploy stops, need to upgrade |
| **Firebase** | 50K reads, 20K writes/day | Requests denied, need to upgrade |
| **OpenAI** | Pay-as-you-go | API calls fail, add credits |

**Monthly Cost Estimate (Free tier):**
- Render: $0
- Vercel: $0
- Firebase: $0
- OpenAI: ~$5-20 (depends on usage)

**Total: ~$5-20/month** for small-medium usage

### Upgrade Path (When You Grow)

**Recommended Upgrade Path:**
1. **First upgrade**: Render Professional ($7/month) - eliminates cold starts
2. **Second upgrade**: Vercel Pro ($20/month) - better analytics, more bandwidth
3. **Third upgrade**: Firebase Blaze plan (pay-as-you-go) - when you exceed free limits

---

## Custom Domain Setup (Optional)

### Add Custom Domain to Frontend

#### Buy a Domain
1. Buy from: Namecheap, GoDaddy, Google Domains, etc.
2. Example: `skillroute.com`

#### Configure in Vercel
1. Vercel Dashboard → Your project → Settings
2. Domains → Add Domain
3. Enter your domain: `skillroute.com`
4. Vercel will show DNS records to add

#### Update DNS
1. Go to your domain registrar
2. Add DNS records as shown by Vercel
3. Wait 1-48 hours for propagation

### Add Custom Domain to Backend

1. Render Dashboard → Your service → Settings
2. Custom Domain → Add Custom Domain
3. Enter: `api.skillroute.com` (subdomain recommended)
4. Add DNS records to your registrar
5. Update `VITE_API_URL` in Vercel to new domain
6. Update CORS in backend with new frontend domain

---

## Security Checklist

Before going to production, verify:

- [ ] All environment variables are set correctly
- [ ] `.env` files are in `.gitignore` (never committed)
- [ ] Firebase Security Rules are restrictive
- [ ] CORS only allows your domains
- [ ] OpenAI API key is kept secret
- [ ] Firebase Admin SDK credentials are secure
- [ ] HTTPS is enabled everywhere (default on Vercel/Render)
- [ ] Regular backups scheduled
- [ ] Monitor logs for suspicious activity

---

## Getting Help

### Official Documentation
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Firebase**: https://firebase.google.com/docs
- **FastAPI**: https://fastapi.tiangolo.com

### Community Support
- **Render Discord**: https://render.com/discord
- **Vercel Discord**: https://vercel.com/discord
- **Stack Overflow**: Tag questions with `render`, `vercel`, `fastapi`

### Check Status Pages
- Render Status: https://status.render.com
- Vercel Status: https://www.vercel-status.com
- Firebase Status: https://status.firebase.google.com

---

## 🎉 Congratulations!

Your SkillRoute application is now live on the internet!

### Your Deployed URLs:
- **Frontend**: `https://skillroute-xxxx.vercel.app`
- **Backend**: `https://skillroute-backend-xxxx.onrender.com`
- **API Docs**: `https://skillroute-backend-xxxx.onrender.com/docs`

### Share Your App:
- Send the Vercel URL to friends/users
- Add it to your portfolio
- Update README.md with live demo link

### Next Steps:
1. Monitor usage and errors
2. Gather user feedback
3. Iterate and improve
4. Consider adding:
   - Email notifications
   - Progress reports
   - Social sharing
   - Premium features

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.

**Happy deploying! 🚀**
