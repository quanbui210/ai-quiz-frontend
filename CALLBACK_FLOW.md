# OAuth Callback Flow Explanation

## Current Flow

### Hash-Based Callback (Supabase OAuth)
1. **User clicks "Sign in with Google"**
   - Frontend calls `/api/auth/login` (Next.js proxy)
   - Backend returns OAuth URL
   - User redirected to Google OAuth

2. **Google redirects back**
   - Google redirects to: `http://localhost:3000/callback.html#access_token=...`
   - Uses **hash fragment** (not query params) because Supabase uses PKCE flow

3. **Frontend callback handling** (DUPLICATE - we have 2!)
   - **Option A**: `public/callback.html` (static HTML) ✅ Currently used
   - **Option B**: `app/callback/page.tsx` (Next.js route) ❌ Duplicate, not used
   
   Both do the same thing:
   - Extract tokens from URL hash
   - POST to `/api/auth/callback` (Next.js API route)
   - Store in localStorage
   - Redirect to dashboard

4. **Next.js API proxy** (`app/api/auth/callback/route.ts`)
   - Proxies POST request to backend `/api/v1/auth/callback`
   - Needed to avoid CORS issues

5. **Backend processing** (`/api/v1/auth/callback`)
   - Handles POST with `access_token` in body
   - Creates/finds user in Prisma
   - Returns `{ user, session }`

6. **Frontend stores and redirects**
   - Stores auth data in localStorage (Zustand format)
   - Redirects to `/dashboard`

## Code-Based Callback (Alternative flow - not currently used)

If using `code` instead of hash:
1. Google redirects to: `http://localhost:3001/api/v1/auth/callback?code=...`
2. Backend processes code directly
3. Backend redirects to frontend with tokens

## Duplication Issue

### Current Duplication:
- ✅ `public/callback.html` - Static HTML, handles hash callback
- ❌ `app/callback/page.tsx` - Next.js route, does the same thing (NOT USED)
- ✅ `app/api/auth/callback/route.ts` - API proxy (NEEDED for CORS)

### Recommendation:
**Keep**: `public/callback.html` (because backend redirects to `/callback.html`)
**Remove**: `app/callback/page.tsx` (duplicate, not needed)
**Keep**: `app/api/auth/callback/route.ts` (needed as CORS proxy)

## Why We Need the Proxy

The Next.js API route (`/api/auth/callback`) is needed because:
- Frontend runs on `localhost:3000`
- Backend runs on `localhost:3001`
- Browser blocks direct cross-origin requests (CORS)
- Proxy makes same-origin request, then server-to-server call (no CORS)

## Backend Callback Handler

Your backend already handles:
- ✅ POST with `access_token` (from hash callback)
- ✅ GET with `code` (from OAuth redirect)
- ✅ User creation/finding in Prisma
- ✅ Returns user and session

The backend is complete! We just need the frontend to:
1. Extract tokens from hash (in `callback.html`)
2. Send to backend via proxy (to avoid CORS)
3. Store response and redirect

