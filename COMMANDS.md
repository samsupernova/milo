# 📝 Deployment Commands Reference

All commands you need to deploy Milo to GitHub and Vercel.

---

## 🔧 Git Setup Commands

### Initial Setup (Run Once)

```bash
# Navigate to project directory
cd C:\Users\karns\OneDrive\Desktop\milo-minor-project

# Check current status
git status

# Create new main branch
git checkout -b main

# Reset any unwanted staged files
git reset

# Add all project files
git add .

# Check what will be committed
git status

# Commit with message
git commit -m "Initial commit: Milo social events platform with Supabase integration"

# Add GitHub remote
git remote add origin https://github.com/samsupernova/milo.git

# Push to GitHub
git push -u origin main
```

### If Remote Already Exists

```bash
# Update remote URL
git remote set-url origin https://github.com/samsupernova/milo.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

### If You Get Authentication Error

Option 1: Use Personal Access Token
```bash
# GitHub will prompt for username and password
# Username: samsupernova
# Password: Use your Personal Access Token (not your GitHub password)
```

Option 2: Use GitHub Desktop
- Download from https://desktop.github.com
- Sign in with GitHub account
- Add repository and push

---

## 🧪 Testing Commands

### Before Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔄 Future Update Commands

### Every Time You Make Changes

```bash
# Check what changed
git status

# Add all changes
git add .

# Or add specific files
git add src/pages/Home.jsx

# Commit with descriptive message
git commit -m "Add new feature: event filtering"

# Push to GitHub (triggers automatic Vercel deployment)
git push

# Check deployment status
# Visit: https://vercel.com/dashboard
```

---

## 🌿 Branch Management

### Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/new-feature-name

# Make changes and commit
git add .
git commit -m "Implement new feature"

# Push feature branch
git push -u origin feature/new-feature-name

# Switch back to main
git checkout main

# Merge feature branch
git merge feature/new-feature-name

# Push merged changes
git push
```

---

## 🔍 Useful Git Commands

### Check Status

```bash
# See current status
git status

# See commit history
git log

# See commit history (one line per commit)
git log --oneline

# See what changed in files
git diff

# See remote repositories
git remote -v

# See all branches
git branch -a
```

### Undo Changes

```bash
# Discard changes in a file
git checkout -- filename.js

# Unstage a file
git reset HEAD filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - CAREFUL!
git reset --hard HEAD~1
```

---

## 🐙 GitHub Commands

### Clone Repository (on another computer)

```bash
git clone https://github.com/samsupernova/milo.git
cd milo
npm install
```

### Pull Latest Changes

```bash
# Get latest changes from GitHub
git pull

# Or specify branch
git pull origin main
```

---

## ☁️ Vercel CLI Commands (Optional)

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy from Command Line

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## 📦 NPM Commands

### Package Management

```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated

# Remove package
npm uninstall package-name

# Clear npm cache
npm cache clean --force
```

---

## 🔐 Environment Variables

### Local Development

```bash
# Create .env file
echo VITE_SUPABASE_URL=your_url > .env
echo VITE_SUPABASE_ANON_KEY=your_key >> .env
echo VITE_GROQ_API_KEY=your_key >> .env

# Or create manually in text editor
notepad .env
```

### Vercel (via CLI)

```bash
# Add environment variable
vercel env add VITE_SUPABASE_URL

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VITE_SUPABASE_URL
```

---

## 🧹 Cleanup Commands

### Clean Build Files

```bash
# Remove dist folder
rm -rf dist

# Remove node_modules
rm -rf node_modules

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Clean Git

```bash
# Remove untracked files (dry run)
git clean -n

# Remove untracked files (for real)
git clean -f

# Remove untracked directories
git clean -fd
```

---

## 🔧 Troubleshooting Commands

### Fix Common Issues

```bash
# If npm install fails
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If build fails
npm run build -- --debug

# If git push fails
git pull --rebase
git push

# If port 5173 is in use
# Kill process on Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

---

## 📊 Monitoring Commands

### Check Deployment Status

```bash
# Via Vercel CLI
vercel ls

# View logs
vercel logs

# View build logs
vercel logs --build

# View function logs
vercel logs --function
```

---

## 🚀 Quick Reference

### Most Common Commands

```bash
# Daily workflow
git status                    # Check status
git add .                     # Stage changes
git commit -m "message"       # Commit
git push                      # Deploy

# Development
npm run dev                   # Start dev server
npm run build                 # Build for production
npm test                      # Run tests

# Troubleshooting
git pull                      # Get latest changes
npm install                   # Install dependencies
npm run build                 # Test build
```

---

## 📝 Command Templates

### Commit Message Templates

```bash
# Feature
git commit -m "feat: add user profile page"

# Bug fix
git commit -m "fix: resolve login authentication issue"

# Update
git commit -m "update: improve event card styling"

# Refactor
git commit -m "refactor: reorganize component structure"

# Documentation
git commit -m "docs: update README with deployment instructions"

# Style
git commit -m "style: format code with prettier"

# Test
git commit -m "test: add tests for auth service"
```

---

## 🔗 Useful Links

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Vercel CLI Docs:** https://vercel.com/docs/cli
- **NPM Documentation:** https://docs.npmjs.com

---

**Keep this file handy for quick reference! 📌**
