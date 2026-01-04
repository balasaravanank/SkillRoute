# 📝 Pre-Deployment Checklist

Print this page and check off each item as you complete it!

---

## Phase 1: Preparation ✅

### Firebase Setup
- [ ] Firebase project created
- [ ] `backend/firebase_key.json` file exists
- [ ] Copied `project_id` from firebase_key.json
- [ ] Copied `client_email` from firebase_key.json  
- [ ] Copied entire `private_key` from firebase_key.json
- [ ] Got frontend Firebase config from Firebase Console
- [ ] Wrote down all 6 Firebase config values:
  - [ ] apiKey
  - [ ] authDomain
  - [ ] projectId
  - [ ] storageBucket
  - [ ] messagingSenderId
  - [ ] appId

### API Keys
- [ ] Have OpenAI API key from backend/.env
- [ ] OpenAI API key has available credits

### GitHub
- [ ] Code pushed to GitHub ✅ (You've done this!)
- [ ] Repository is accessible (public or private with access)

---

## Phase 2: Backend Deployment (Render) 🟦

### Account Setup
- [ ] Created Render account at render.com
- [ ] Connected GitHub to Render
- [ ] Can see my repositories in Render

### Service Configuration
- [ ] Created new Web Service
- [ ] Connected skillroute repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Selected Free plan

### Environment Variables (6 Required)
- [ ] Added `PROJECT_NAME=SkillRoute`
- [ ] Added `ENV=production`
- [ ] Added `OPENAI_API_KEY=[your key]`
- [ ] Added `FIREBASE_PROJECT_ID=[from firebase_key.json]`
- [ ] Added `FIREBASE_CLIENT_EMAIL=[from firebase_key.json]`
- [ ] Added `FIREBASE_PRIVATE_KEY=[entire private key]`

### Deployment
- [ ] Clicked "Create Web Service"
- [ ] Waited for build to complete (3-5 minutes)
- [ ] Service shows "Live" status
- [ ] Copied backend URL: `https://______________.onrender.com`

### Testing
- [ ] Visited backend URL in browser
- [ ] Saw JSON response: `{"app": "SkillRoute", "status": "running"}`
- [ ] Visited `/docs` endpoint
- [ ] FastAPI documentation page loads

**Backend URL (write it down!):**
```
https://________________________________.onrender.com
```

---

## Phase 3: Frontend Deployment (Vercel) 🔺

### Account Setup
- [ ] Created Vercel account at vercel.com
- [ ] Connected GitHub to Vercel
- [ ] Can see my repositories in Vercel

### Project Configuration
- [ ] Clicked "Add New Project"
- [ ] Imported skillroute repository
- [ ] Set Root Directory: `frontend`
- [ ] Framework detected as Vite
- [ ] Build settings are correct (default)

### Environment Variables (7 Required)
- [ ] Added `VITE_FIREBASE_API_KEY`
- [ ] Added `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Added `VITE_FIREBASE_PROJECT_ID`
- [ ] Added `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Added `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Added `VITE_FIREBASE_APP_ID`
- [ ] Added `VITE_API_URL` (backend URL from above, NO trailing slash)
- [ ] All variables set for "All" environments

### Deployment
- [ ] Clicked "Deploy"
- [ ] Waited for build (1-3 minutes)
- [ ] Saw success/confetti screen
- [ ] Copied frontend URL: `https://______________.vercel.app`

### Testing
- [ ] Visited frontend URL
- [ ] Landing page loads
- [ ] No errors in browser console (F12)

**Frontend URL (write it down!):**
```
https://________________________________.vercel.app
```

---

## Phase 4: Post-Deployment Configuration 🔧

### Backend CORS Update
- [ ] Opened `backend/app/main.py`
- [ ] Added my Vercel URL to `allow_origins` list
- [ ] Saved file
- [ ] Committed changes: `git add backend/app/main.py`
- [ ] Committed: `git commit -m "Add production CORS"`
- [ ] Pushed: `git push origin main`
- [ ] Waited for Render to auto-redeploy (2-3 minutes)
- [ ] Checked Render shows "Live" again

### Firebase Configuration
- [ ] Opened Firebase Console
- [ ] Went to Authentication → Sign-in method
- [ ] Email/Password provider is enabled
- [ ] Scrolled to "Authorized domains"
- [ ] Added my Vercel domain (without https://)
- [ ] Domain shows in authorized list

### Firestore Rules (if using database)
- [ ] Opened Firebase Console → Firestore Database
- [ ] Went to Rules tab
- [ ] Rules are NOT set to `allow read, write: if true;`
- [ ] Rules require authentication
- [ ] Published rules

---

## Phase 5: Final Testing 🧪

### Full Application Test
- [ ] Opened frontend URL in browser
- [ ] Opened browser console (F12)
- [ ] Clicked "Sign Up"
- [ ] Created test account with email/password
- [ ] Account creation successful
- [ ] Redirected to dashboard/profile
- [ ] Filled out profile form
- [ ] Submitted form
- [ ] No errors in console
- [ ] No CORS errors

### Database Verification
- [ ] Opened Firebase Console → Firestore
- [ ] Can see new document in `students` collection
- [ ] Data looks correct

### Backend API Test
- [ ] Visited `[backend-url]/docs`
- [ ] Tried a GET endpoint (like `/students`)
- [ ] Got successful response

### Performance Check
- [ ] Frontend loads in under 3 seconds
- [ ] Backend responds (after cold start)
- [ ] No console errors
- [ ] Images/assets load properly

---

## Phase 6: Documentation & Cleanup 📚

### Update Repository
- [ ] Updated README.md with live demo links
- [ ] Added deployment badges (optional)
- [ ] Documented any custom configuration

### Security
- [ ] `.env` files are in `.gitignore`
- [ ] No secrets committed to GitHub
- [ ] Firebase rules are secure
- [ ] CORS only allows my domains

### Monitoring Setup
- [ ] Bookmarked Render dashboard
- [ ] Bookmarked Vercel dashboard
- [ ] Bookmarked Firebase console
- [ ] Know how to check logs in each platform

---

## 🎉 Deployment Complete!

### My Deployed URLs:

**Frontend (User-facing):**
```
https://________________________________.vercel.app
```

**Backend API:**
```
https://________________________________.onrender.com
```

**API Documentation:**
```
https://________________________________.onrender.com/docs
```

### Share Your App:
- [ ] Tested sharing link with a friend
- [ ] Added to portfolio/resume
- [ ] Posted on social media (optional)

---

## Maintenance Reminders

### Weekly:
- [ ] Check Render/Vercel dashboards for errors
- [ ] Monitor Firebase usage
- [ ] Review application logs

### Monthly:
- [ ] Check OpenAI API usage/costs
- [ ] Review Firebase quotas
- [ ] Update dependencies if needed

### When Needed:
- [ ] Deploy updates: just `git push`!
- [ ] Monitor cold starts on Render (15min idle → sleep)
- [ ] Consider upgrading if traffic grows

---

**Date Deployed:** _______________

**Deployed By:** _______________

**Notes:**
```
_______________________________________________
_______________________________________________
_______________________________________________
```

---

✅ **Congratulations! Your app is live!** 🚀
