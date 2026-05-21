# Fix: Email Rate Limit Exceeded Error

## Problem
Getting "email rate limit exceeded" error when trying to sign up new users.

## Why This Happens
Supabase's free tier has rate limits on sending emails. By default, Supabase sends a confirmation email to every new user signup, which can quickly hit the rate limit during development/testing.

## Solution: Disable Email Confirmation (For Development)

### Step-by-Step Instructions:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/dsmxbcoazaojmeycziqz
   - Or go to https://supabase.com/dashboard and select your project

2. **Navigate to Authentication Settings**
   - Click on **"Authentication"** in the left sidebar
   - Click on the **"Providers"** tab at the top

3. **Configure Email Provider**
   - Scroll down to find the **"Email"** provider section
   - Find the toggle for **"Confirm email"**
   - **Turn OFF** the "Confirm email" toggle
   - Click **"Save"** button at the bottom

4. **Test Again**
   - Go back to your app: http://localhost:5175/
   - Try creating a new account
   - It should work without the rate limit error!

## Alternative: Wait for Rate Limit Reset

If you don't want to disable email confirmation:
- Wait 1 hour for the rate limit to reset
- Use a different email address
- Upgrade to a paid Supabase plan (higher limits)

## For Production

When you're ready to deploy to production:
1. **Re-enable email confirmation** for security
2. **Configure a custom SMTP provider** (like SendGrid, AWS SES, etc.)
3. **Upgrade your Supabase plan** for higher rate limits

### How to Configure Custom SMTP:
1. Go to Authentication → Email Templates
2. Click "Settings" 
3. Add your SMTP credentials
4. This bypasses Supabase's email rate limits

## Verification

After disabling email confirmation:
- ✅ Users can sign up instantly without waiting for email
- ✅ No rate limit errors
- ✅ Users are automatically confirmed
- ⚠️ Less secure (only for development)

## Current Status

I've updated the error message in the code to be more helpful. If you still see the error, it will now tell you exactly what to do.

## Quick Test

After making the change in Supabase:
1. Clear your browser cache/localStorage
2. Go to http://localhost:5175/onboarding
3. Try creating a new account with a fresh email
4. Should work immediately! 🎉
