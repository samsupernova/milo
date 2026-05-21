# Test Supabase Connection

## The Problem

Login is stuck at "Attempting sign in for: abcd@demo.com" which means the Supabase auth request is hanging and not returning a response.

## Possible Causes

1. **Supabase project is paused** (free tier auto-pauses after inactivity)
2. **Network/firewall blocking Supabase**
3. **Account doesn't exist**
4. **Email confirmation required**

## Quick Tests

### Test 1: Check if Supabase Project is Active

1. Go to: https://supabase.com/dashboard/project/dsmxbcoazaojmeycziqz
2. Look for a message saying "Project is paused"
3. If paused, click "Restore project" or "Resume"
4. Wait 1-2 minutes for it to wake up
5. Try logging in again

### Test 2: Check Network Connection

1. Open browser console (F12)
2. Go to "Network" tab
3. Try logging in
4. Look for a request to `supabase.co`
5. Check if it's:
   - ❌ **Pending forever** = Connection issue
   - ❌ **Failed/Red** = Network blocked
   - ✅ **Completed with 200** = Working (but other issue)
   - ❌ **400/401** = Wrong credentials

### Test 3: Verify Account Exists

1. Go to Supabase Dashboard
2. Click "Authentication" → "Users"
3. Look for `abcd@demo.com`
4. If it exists:
   - Check if "Email Confirmed" = Yes
   - If No, either:
     - Confirm it manually (click user → confirm email)
     - OR disable email confirmation (see FIX_EMAIL_RATE_LIMIT.md)

### Test 4: Test Supabase Connection Directly

Open browser console and run:

```javascript
// Test 1: Check if supabase is loaded
console.log('Supabase URL:', 'https://dsmxbcoazaojmeycziqz.supabase.co');

// Test 2: Try a simple query
fetch('https://dsmxbcoazaojmeycziqz.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXhiY29hemFvam1leWN6aXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzI0ODMsImV4cCI6MjA5NDYwODQ4M30.TgvWAfCJyVCnrgfqmDCzFQvu4G8h0vNEYhc-2lSlKVc'
  }
})
.then(r => r.json())
.then(d => console.log('Supabase is reachable:', d))
.catch(e => console.error('Supabase connection failed:', e));
```

If this fails, Supabase is not reachable.

## Solutions

### Solution 1: Resume Paused Project (Most Likely)

**Supabase free tier projects pause after 1 week of inactivity.**

1. Go to: https://supabase.com/dashboard/project/dsmxbcoazaojmeycziqz
2. If you see "Project is paused" banner:
   - Click "Restore project" or "Resume"
   - Wait 1-2 minutes
3. Try logging in again
4. Should work now!

### Solution 2: Create New Account

If the account doesn't exist or has issues:

1. **Clear browser data** (F12 → Application → Clear site data)
2. **Go to onboarding**: http://localhost:5175/onboarding
3. **Use a DIFFERENT email**: `test123@test.com`
4. **Complete all 5 steps**
5. Should work immediately!

### Solution 3: Disable Email Confirmation

If email confirmation is blocking:

1. Go to Supabase Dashboard
2. Authentication → Providers → Email
3. Turn OFF "Confirm email"
4. Save
5. Try again

### Solution 4: Check Firewall/VPN

If you're on a corporate network or using VPN:

1. Try disabling VPN
2. Check if firewall is blocking `supabase.co`
3. Try on a different network (mobile hotspot)

## After Fixing

With the updated code, you should now see:
- Either an error message after 10 seconds (timeout)
- Or successful login with these logs:
  ```
  Attempting sign in for: abcd@demo.com
  Auth successful, fetching profile...
  Profile fetched, fetching events...
  Sign in complete!
  ```

## Most Likely Solution

**Your Supabase project is probably paused.** Go to the dashboard and resume it. This is the #1 cause of hanging requests on free tier projects.
