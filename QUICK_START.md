# 🚀 Quick Start Guide - Deploy Milo in 15 Minutes

Follow these steps to get your Milo app live on the internet!

---

## Step 1: Prepare Git Repository (2 minutes)

Open your terminal in the project folder and run:

```bash
# Navigate to project
cd C:\Users\karns\OneDrive\Desktop\milo-minor-project

# Check current status
git status

# Create a new clean branch
git checkout -b main

# Reset any staged files from parent directories
git reset

# Add only project files
git add .

# Commit
git commit -m "Initial commit: Milo social events platform"
```

---

## Step 2: Push to GitHub (3 minutes)

### Create Repository on GitHub:

1. Go to https://github.com/samsupernova
2. Click **"New repository"** (green button)
3. Repository name: **`milo`**
4. Description: **"Milo - Social Events Platform for Jaipur"**
5. Keep it **Public**
6. **DO NOT** check any boxes (no README, no .gitignore, no license)
7. Click **"Create repository"**

### Push Your Code:

```bash
# Add remote
git remote add origin https://github.com/samsupernova/milo.git

# Push to GitHub
git push -u origin main
```

**If you get authentication error:**
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app

---

## Step 3: Deploy to Vercel (5 minutes)

### Sign Up:

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your repositories

### Import Project:

1. Click **"Add New..."** → **"Project"**
2. Find and select **`samsupernova/milo`**
3. Click **"Import"**

### Configure:

Vercel will auto-detect settings. Just verify:
- Framework: **Vite** ✓
- Build Command: **`npm run build`** ✓
- Output Directory: **`dist`** ✓

### Add Environment Variables:

Click **"Environment Variables"** and add these 3 variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://tonoebhxwstswtzgooxj.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbm9lYmh4d3N0c3d0emdvb3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAyNjUsImV4cCI6MjA5NDYxNjI2NX0.V1A_DVbq_-aGiEFXehVY-jS4KygtbDZ8hV4X_eBn64E` |
| `VITE_GROQ_API_KEY` | `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` |

**Important:** Make sure to add to all environments (Production, Preview, Development)

### Deploy:

1. Click **"Deploy"**
2. Wait 2-3 minutes ⏳
3. You'll get a URL like: `https://milo-xyz123.vercel.app` 🎉

---

## Step 4: Test Your Deployment (2 minutes)

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Can register a new user
- [ ] Can login
- [ ] Can create an event
- [ ] Can join an event
- [ ] Discussion forum works
- [ ] Milo Bot responds to @milo

---

## Step 5: Connect Custom Domain (3 minutes)

### On Name.com:

1. Log in to https://www.name.com
2. Go to **"My Domains"**
3. Click your domain
4. Go to **"DNS Records"**

### Add These Records:

**For root domain (yourdomain.com):**
- Type: **A**
- Host: **@**
- Answer: **76.76.21.21**
- TTL: **300**

**For www subdomain (www.yourdomain.com):**
- Type: **CNAME**
- Host: **www**
- Answer: **cname.vercel-dns.com**
- TTL: **300**

### On Vercel:

1. Go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your domain: `yourdomain.com`
4. Add www subdomain: `www.yourdomain.com`
5. Wait for DNS verification (5 mins - 2 hours)

---

## 🎉 You're Live!

Your Milo app is now live on the internet!

**Vercel URL:** `https://milo-xyz123.vercel.app`
**Custom Domain:** `https://yourdomain.com` (after DNS propagation)

---

## 🔄 Future Updates

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy! 🚀

---

## 🐛 Troubleshooting

### Build Failed
- Check Vercel build logs
- Make sure all dependencies are in package.json
- Try building locally: `npm run build`

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check Vercel logs for errors

### Custom Domain Not Working
- Wait longer (DNS can take up to 48 hours)
- Check DNS records are correct
- Use https://dnschecker.org to verify propagation

---

## 📞 Need Help?

- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

**Happy Deploying! 🚀**
