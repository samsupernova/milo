# Fix: Login Stuck on "Logging in..."

## Likely Causes

1. **Account created before Supabase integration** - The auth user exists but no profile in `users` table
2. **Email confirmation required** - Account needs email verification
3. **Network/Supabase connection issue**

## Quick Fixes

### Option 1: Create a Fresh Account (Recommended)

1. **Clear browser data:**
   - Press F12 to open DevTools
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Click "Clear site data" or manually delete:
     - Local Storage
     - Session Storage
     - Cookies

2. **Go to Onboarding:**
   - Visit: http://localhost:5175/onboarding
   - Create a NEW account with a DIFFERENT email
   - Complete all 5 steps
   - Should work immediately!

### Option 2: Check Browser Console

1. **Open browser console:**
   - Press F12
   - Go to "Console" tab

2. **Look for errors:**
   - Try logging in again
   - Check what error appears in console
   - Look for messages like:
     - "Auth sign in error"
     - "Profile fetch error"
     - "Sign in complete!"

3. **Common errors and fixes:**

   **Error: "Invalid login credentials"**
   - Wrong email/password
   - Create a new account instead

   **Error: "Row not found" or "Profile fetch error"**
   - Auth user exists but no profile in database
   - Solution: Create a new account OR manually add profile

   **Error: "Email not confirmed"**
   - Email confirmation is enabled
   - Solution: Disable email confirmation in Supabase (see FIX_EMAIL_RATE_LIMIT.md)

### Option 3: Delete Old Auth Users in Supabase

If you created test accounts before:

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/dsmxbcoazaojmeycziqz

2. **Navigate to Authentication:**
   - Click "Authentication" in sidebar
   - Click "Users" tab

3. **Delete old users:**
   - Find any test users
   - Click the "..." menu
   - Click "Delete user"
   - Confirm deletion

4. **Create fresh account:**
   - Go back to your app
   - Create a new account through onboarding

### Option 4: Check Supabase Connection

1. **Verify environment variables:**
   - Check `.env` file exists
   - Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set

2. **Test Supabase connection:**
   - Open browser console
   - Type: `localStorage.getItem('supabase.auth.token')`
   - Should show a token if connected

3. **Restart dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```

## Debug Steps

### Step 1: Check Console Logs

With the updated code, you should see these logs when logging in:

```
Attempting sign in for: your@email.com
Auth successful, fetching profile...
Profile fetched, fetching events...
Sign in complete!
```

If it stops at any step, that's where the issue is.

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Try logging in
3. Look for failed requests (red)
4. Check the response for error details

### Step 3: Verify Database

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Check `users` table
4. Verify your user exists with correct data

## Recommended Solution

**Just create a fresh account:**

1. Clear browser data (F12 → Application → Clear site data)
2. Go to http://localhost:5175/onboarding
3. Use a NEW email (can be fake like test123@test.com)
4. Complete all 5 steps
5. Should log in automatically!

## After Fixing

Once you can log in:
- ✅ Dashboard should show your name
- ✅ No old events should appear
- ✅ You can create new events
- ✅ Everything should work smoothly

## Still Stuck?

Check the browser console and share the error message. The updated code now logs detailed information about where the login process fails.
