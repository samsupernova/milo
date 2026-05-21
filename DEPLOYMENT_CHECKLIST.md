# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## 📋 Pre-Deployment

### Code Preparation
- [x] Build tested locally (`npm run build` successful)
- [x] Environment variables configured
- [x] `.env` added to `.gitignore`
- [x] `.env.example` created for reference
- [x] Supabase client uses environment variables
- [x] Groq API uses environment variables
- [x] All features tested locally
- [x] No console errors in browser

### Documentation
- [x] README.md created
- [x] DEPLOYMENT_GUIDE.md created
- [x] QUICK_START.md created
- [x] Environment variables documented

### Git Repository
- [ ] Git repository cleaned (no parent directory files)
- [ ] All project files committed
- [ ] Commit message is descriptive
- [ ] Branch is `main` (not `qr` or other)

---

## 🐙 GitHub Deployment

### Repository Creation
- [ ] Logged into GitHub (https://github.com/samsupernova)
- [ ] Created new repository named `milo`
- [ ] Repository is Public
- [ ] Did NOT initialize with README/gitignore/license

### Push Code
- [ ] Remote added: `git remote add origin https://github.com/samsupernova/milo.git`
- [ ] Code pushed: `git push -u origin main`
- [ ] Repository visible on GitHub
- [ ] All files present in repository
- [ ] `.env` file NOT visible (should be ignored)

---

## ☁️ Vercel Deployment

### Account Setup
- [ ] Signed up at https://vercel.com
- [ ] Connected GitHub account
- [ ] Authorized Vercel to access repositories

### Project Import
- [ ] Imported `samsupernova/milo` repository
- [ ] Framework detected as Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables
Add these 3 variables to Vercel:

- [ ] `VITE_SUPABASE_URL` = `https://tonoebhxwstswtzgooxj.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- [ ] `VITE_GROQ_API_KEY` = `gsk_ftaabtRDRKAmkkjO1xeTWGdyb3FY...`
- [ ] All variables added to Production environment
- [ ] All variables added to Preview environment
- [ ] All variables added to Development environment

### Deployment
- [ ] Clicked "Deploy" button
- [ ] Build completed successfully (no errors)
- [ ] Deployment URL received (e.g., `https://milo-xyz123.vercel.app`)
- [ ] Deployment URL saved for reference

---

## 🧪 Testing Deployed App

### Basic Functionality
Visit your Vercel URL and test:

- [ ] Homepage loads correctly
- [ ] All images load
- [ ] Navigation works
- [ ] Responsive design works on mobile

### User Authentication
- [ ] Can access registration page
- [ ] Can register new user
- [ ] Registration saves to Supabase
- [ ] Can login with registered user
- [ ] Can logout
- [ ] Session persists on page refresh

### Event Features
- [ ] Can view events on Explore page
- [ ] Events load from Supabase
- [ ] Can view event details
- [ ] Can join an event
- [ ] Join count updates correctly
- [ ] Can create new event (Host page)
- [ ] New event appears in database
- [ ] New event shows on profile
- [ ] Can delete own hosted event

### Discussion Forum
- [ ] Can access discussion page
- [ ] Can send messages
- [ ] Messages appear in chat
- [ ] Can mention @milo
- [ ] Milo Bot responds
- [ ] Can delete own messages

### Profile & Dashboard
- [ ] Profile page shows user info
- [ ] Shows hosted events
- [ ] Shows joined events
- [ ] Dashboard shows upcoming events
- [ ] Calendar view works

---

## 🌍 Custom Domain Setup

### Name.com Configuration
- [ ] Logged into Name.com account
- [ ] Selected domain
- [ ] Navigated to DNS Records

### DNS Records Added
- [ ] A record: `@` → `76.76.21.21` (TTL: 300)
- [ ] CNAME record: `www` → `cname.vercel-dns.com` (TTL: 300)
- [ ] DNS changes saved

### Vercel Domain Configuration
- [ ] Added root domain in Vercel (e.g., `yourdomain.com`)
- [ ] Added www subdomain in Vercel (e.g., `www.yourdomain.com`)
- [ ] DNS verification started
- [ ] Waiting for DNS propagation (can take 5 mins - 48 hours)

### Domain Verification
- [ ] DNS propagation complete (check https://dnschecker.org)
- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] HTTPS certificate issued automatically
- [ ] Can access site via custom domain
- [ ] HTTPS works (green padlock in browser)
- [ ] www subdomain redirects to root domain (or vice versa)

---

## 🔐 Security Review

### Before Public Launch
- [ ] ⚠️ **CRITICAL:** Implement password hashing (currently plain text!)
- [ ] Review Supabase Row Level Security (RLS) policies
- [ ] Add rate limiting to API endpoints
- [ ] Validate all user inputs
- [ ] Sanitize data before database insertion
- [ ] Configure CORS properly
- [ ] Review and rotate API keys
- [ ] Use different API keys for production
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Set up uptime monitoring

---

## 📊 Post-Deployment

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Supabase dashboard bookmarked
- [ ] Error tracking configured
- [ ] Performance monitoring active

### Documentation
- [ ] Deployment URL documented
- [ ] Custom domain documented
- [ ] Environment variables backed up securely
- [ ] Database credentials backed up securely

### Sharing
- [ ] Shared URL with team/friends for testing
- [ ] Gathered initial feedback
- [ ] Created list of improvements based on feedback

---

## 🚀 Future Updates Workflow

For every future update:

1. **Make changes locally**
   - [ ] Test changes locally
   - [ ] Run `npm run build` to verify build works
   - [ ] Test built version with `npm run preview`

2. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

3. **Automatic deployment**
   - [ ] Vercel automatically deploys on push
   - [ ] Check deployment status in Vercel dashboard
   - [ ] Test deployed changes on live URL

---

## 📝 Notes

### Vercel URL
```
https://milo-xyz123.vercel.app
```
(Replace with your actual URL)

### Custom Domain
```
https://yourdomain.com
```
(Replace with your actual domain)

### Important Links
- GitHub Repo: https://github.com/samsupernova/milo
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- Name.com DNS: https://www.name.com/account/domain

---

## ✅ Deployment Complete!

Once all items are checked, your Milo app is successfully deployed and live on the internet! 🎉

**Next Steps:**
1. Share with friends and gather feedback
2. Monitor usage and performance
3. Implement security improvements (especially password hashing!)
4. Add new features based on user feedback
5. Scale as needed

---

**Congratulations on your deployment! 🚀**
