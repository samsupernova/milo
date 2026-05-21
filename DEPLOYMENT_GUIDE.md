# Milo Deployment Guide

Complete guide to deploy Milo to GitHub and host on Vercel with custom domain.

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Supabase integration working
- [x] All features tested locally
- [x] Build scripts configured
- [x] Environment variables identified

### ⚠️ Security Recommendations
- [ ] Move Supabase credentials to environment variables
- [ ] Move Groq API key to environment variables
- [ ] Implement password hashing (CRITICAL for production)

---

## 🚀 Part 1: Deploy to GitHub

### Step 1: Clean Up Git Repository

Your git repository is currently tracking files from parent directories. We need to fix this first.

```bash
# Navigate to your project root
cd C:\Users\karns\OneDrive\Desktop\milo-minor-project

# Check current branch
git branch

# If you're on 'qr' branch, create a new clean branch for deployment
git checkout -b main

# Remove all staged files from parent directories
git reset

# Add only files from current project
git add .

# Check what will be committed
git status
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/samsupernova
2. Click "New repository" (green button)
3. Repository name: `milo`
4. Description: "Milo - Social Events Platform for Jaipur"
5. Keep it **Public** (required for free Vercel hosting)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/samsupernova/milo.git

# Or if remote already exists, update it
git remote set-url origin https://github.com/samsupernova/milo.git

# Commit your changes
git add .
git commit -m "Initial commit: Milo social events platform with Supabase integration"

# Push to GitHub
git push -u origin main
```

If you encounter authentication issues:
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop application

---

## 🌐 Part 2: Deploy to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub account (recommended)
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import `samsupernova/milo` repository
3. Vercel will auto-detect it's a Vite project

### Step 3: Configure Build Settings

Vercel should auto-detect these settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_SUPABASE_URL` | `your_supabase_url_here` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key_here` | Your Supabase anon key |
| `VITE_GROQ_API_KEY` | `your_groq_api_key_here` | Your Groq API key |

**Important:** Add these to all environments (Production, Preview, Development)

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://milo-xyz123.vercel.app`

---

## 🔧 Part 3: Update Code for Environment Variables

After deployment, update your code to use environment variables:

### Update `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tonoebhxwstswtzgooxj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Update `src/pages/Discussion.jsx` (Groq API):

```javascript
const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY || 'gsk_ftaabtRDRKAmkkjO1xeTWGdyb3FY...'}`,
    },
    // ... rest of config
  }
);
```

### Create `.env.example` file:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Create `.env` file (for local development):

```env
VITE_SUPABASE_URL=https://tonoebhxwstswtzgooxj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbm9lYmh4d3N0c3d0emdvb3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAyNjUsImV4cCI6MjA5NDYxNjI2NX0.V1A_DVbq_-aGiEFXehVY-jS4KygtbDZ8hV4X_eBn64E
VITE_GROQ_API_KEY=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
```

### Update `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
```

---

## 🌍 Part 4: Connect Custom Domain (Name.com)

### Step 1: Get Your Vercel Domain

After deployment, note your Vercel domain:
- Example: `milo-xyz123.vercel.app`

### Step 2: Configure DNS on Name.com

1. Log in to https://www.name.com
2. Go to "My Domains"
3. Click on your domain
4. Go to "DNS Records" or "Manage DNS"

### Step 3: Add DNS Records

Add these records:

#### For Root Domain (example.com):

| Type | Host | Answer/Value | TTL |
|------|------|--------------|-----|
| A | @ | 76.76.21.21 | 300 |

#### For WWW Subdomain (www.example.com):

| Type | Host | Answer/Value | TTL |
|------|------|--------------|-----|
| CNAME | www | cname.vercel-dns.com | 300 |

**Note:** Replace `@` with your actual domain name if Name.com requires it.

### Step 4: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `yourdomain.com`)
4. Add www subdomain (e.g., `www.yourdomain.com`)
5. Vercel will verify DNS configuration

### Step 5: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours
- Usually completes within 1-2 hours
- Check status in Vercel dashboard

### Step 6: Enable HTTPS

Vercel automatically provisions SSL certificates via Let's Encrypt:
- This happens automatically after DNS verification
- Your site will be accessible via `https://yourdomain.com`

---

## 🔍 Verification Steps

### Test Your Deployment

1. **Visit your Vercel URL:** `https://milo-xyz123.vercel.app`
   - [ ] Homepage loads correctly
   - [ ] Can register new user
   - [ ] Can login
   - [ ] Can create events
   - [ ] Can join events
   - [ ] Discussion forum works
   - [ ] Milo Bot responds

2. **Visit your custom domain:** `https://yourdomain.com`
   - [ ] Same tests as above
   - [ ] HTTPS is working (green padlock)

3. **Check Supabase Connection:**
   - [ ] Events load from database
   - [ ] New events save to database
   - [ ] User authentication works

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error:** "Module not found" or "Cannot find package"
- **Solution:** Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error:** "Build exceeded maximum duration"
- **Solution:** Check for infinite loops or heavy computations during build

### Environment Variables Not Working

**Symptoms:** Supabase connection fails, API calls fail
- **Solution:** 
  1. Check variable names start with `VITE_`
  2. Redeploy after adding environment variables
  3. Use `import.meta.env.VITE_VARIABLE_NAME` in code

### Custom Domain Not Working

**Error:** "Domain not found" or "DNS_PROBE_FINISHED_NXDOMAIN"
- **Solution:** 
  1. Wait longer for DNS propagation (up to 48 hours)
  2. Verify DNS records are correct
  3. Use https://dnschecker.org to check propagation status

**Error:** "Invalid configuration" in Vercel
- **Solution:** 
  1. Make sure A record points to `76.76.21.21`
  2. Make sure CNAME points to `cname.vercel-dns.com`

### Images Not Loading

**Symptoms:** Event images show broken image icon
- **Solution:** 
  1. Check if images are in `src/assets` folder
  2. Verify image imports in components
  3. Check browser console for 404 errors

---

## 📊 Post-Deployment Monitoring

### Vercel Analytics (Free)

1. Go to your project in Vercel
2. Click "Analytics" tab
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Supabase Monitoring

1. Go to Supabase dashboard
2. Check:
   - Database usage
   - API requests
   - Storage usage
   - Active connections

---

## 🔐 Security Recommendations (IMPORTANT)

### Before Going Live to Public:

1. **Implement Password Hashing**
   - Currently passwords are stored in plain text
   - Use bcrypt or similar library
   - This is CRITICAL for production

2. **Rate Limiting**
   - Add rate limiting to API endpoints
   - Prevent abuse of Groq API
   - Use Vercel Edge Config or Upstash

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database insertion
   - Prevent SQL injection

4. **CORS Configuration**
   - Configure proper CORS headers
   - Restrict API access to your domain

5. **Environment Variables**
   - Never commit `.env` file
   - Rotate API keys regularly
   - Use different keys for dev/prod

---

## 📝 Deployment Commands Quick Reference

```bash
# Initial setup
git checkout -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/samsupernova/milo.git
git push -u origin main

# Future updates
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically redeploy on every push to main branch
```

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Custom domain connected
- [ ] HTTPS working
- [ ] All features tested on live site
- [ ] Supabase connection verified
- [ ] Milo Bot working
- [ ] Mobile responsive design verified

---

## 📞 Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Name.com Support:** https://www.name.com/support
- **Vite Documentation:** https://vitejs.dev/guide/

---

## 🚀 Next Steps After Deployment

1. Share your live URL with friends for testing
2. Gather feedback on user experience
3. Monitor Vercel analytics for usage patterns
4. Implement password hashing (CRITICAL)
5. Add more events to showcase the platform
6. Consider adding features like:
   - Email notifications
   - Event reminders
   - User profiles with photos
   - Event categories/filters
   - Search functionality

---

**Good luck with your deployment! 🎊**
