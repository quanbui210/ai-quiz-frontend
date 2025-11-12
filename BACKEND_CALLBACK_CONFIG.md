# Backend Callback Configuration Guide

## Current Situation

You have:
- **Backend**: `callback.html` file (used for Postman testing)
- **Backend**: `/api/v1/auth/callback` route handler (returns JSON)
- **Frontend**: `public/callback.html` (handles OAuth callback)
- **OAuth Redirect**: Currently configured to redirect to `http://localhost:3000/callback.html`

## Option 1: Keep Frontend Callback (Recommended) ✅

**Current Setup** - This is what you have now:
- Google OAuth redirects to: `http://localhost:3000/callback.html#access_token=...`
- Frontend `callback.html` processes it
- Frontend sends tokens to backend via proxy
- Backend processes and returns user/session

**Backend `callback.html`**: Keep it for testing, or remove it (not used in production flow)

## Option 2: Use Backend Callback and Redirect to Frontend

If you want to use your backend `callback.html`:

### Step 1: Update OAuth Redirect URL
In your Supabase/Google OAuth config, change redirect URL to:
```
http://localhost:3001/callback.html
```
(Backend URL instead of frontend)

### Step 2: Modify Backend `callback.html`
Update your backend `callback.html` to redirect to frontend after processing:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Completing Sign In...</title>
  <script>
    (function() {
      try {
        // Extract tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        // ... other tokens

        if (!accessToken) {
          window.location.href = 'http://localhost:3000/login?error=no_access_token';
          return;
        }

        // Send to backend API
        fetch('http://localhost:3001/api/v1/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            // ... other tokens
          }),
        })
        .then(response => response.json())
        .then(data => {
          // Redirect to frontend with tokens in URL (or use postMessage)
          // Option A: Redirect with tokens in hash
          const tokens = encodeURIComponent(JSON.stringify({
            user: data.user,
            session: data.session
          }));
          window.location.href = `http://localhost:3000/callback?tokens=${tokens}`;
          
          // Option B: Use postMessage (if same origin or configured)
          // window.opener.postMessage({ type: 'AUTH_SUCCESS', data }, 'http://localhost:3000');
        })
        .catch(error => {
          window.location.href = 'http://localhost:3000/login?error=' + encodeURIComponent(error.message);
        });
      } catch (error) {
        window.location.href = 'http://localhost:3000/login?error=' + encodeURIComponent(error.message);
      }
    })();
  </script>
</head>
<body>
  <p>Completing sign in...</p>
</body>
</html>
```

### Step 3: Update Frontend to Handle Redirect
Create a frontend route to receive the tokens from backend redirect.

## Option 3: Backend Route Redirects to Frontend (Best for Production)

Modify your backend route handler to redirect to frontend after processing:

```typescript
// In your backend handleCallback function
export const handleCallback = async (req: Request, res: Response) => {
  try {
    // ... existing code to process callback ...
    
    // After successful authentication
    const user = sessionData.user;
    const session = sessionData.session;
    
    // Option A: Redirect with tokens in URL (less secure, visible in URL)
    const tokens = encodeURIComponent(JSON.stringify({ user, session }));
    return res.redirect(`http://localhost:3000/callback?tokens=${tokens}`);
    
    // Option B: Set cookies and redirect (more secure)
    // res.cookie('auth_token', session.access_token, { httpOnly: true });
    // return res.redirect('http://localhost:3000/callback');
    
    // Option C: Return JSON and let frontend handle (current approach)
    // return res.json({ user, session });
  } catch (error) {
    return res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(error.message)}`);
  }
};
```

## Recommendation

**Keep Option 1 (Current Setup)** because:
- ✅ Frontend handles callback directly (better UX)
- ✅ No cross-domain redirects needed
- ✅ Tokens stay in frontend domain
- ✅ Backend `callback.html` can remain for testing

**If you want to use backend callback.html:**
- Use Option 3 (modify route handler to redirect)
- Keep `callback.html` for manual testing
- Configure OAuth to redirect to backend
- Backend redirects to frontend after processing

## Environment Variables

Make sure your backend has:
```env
FRONTEND_URL=http://localhost:3000
```

Then use it in redirects:
```typescript
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
return res.redirect(`${frontendUrl}/callback?tokens=...`);
```

