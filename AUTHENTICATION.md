# Authentication Setup Guide

## Overview

Your application now has a complete authentication system with Google OAuth integration, matching the design from your reference images.

## What's Been Created

### 1. TypeScript Types (`types/`)
- **`prisma.ts`** - All Prisma schema types (User, Topic, Quiz, Question, Answer, etc.)
- **`api.ts`** - API request/response types for authentication
- **`index.ts`** - Convenient re-exports

### 2. Authentication Store (`stores/use-auth-store.ts`)
- Zustand store with persistence
- Manages user session and authentication state
- Automatically syncs with localStorage

### 3. Authentication Hook (`hooks/use-auth.ts`)
- `login()` - Initiates Google OAuth flow
- `signOut()` - Signs out user
- `handleCallback()` - Handles OAuth callback
- `isAuthenticated` - Current auth status
- `user` - Current user data

### 4. Layout Components (`components/layout/`)
- **`sidebar.tsx`** - Navigation sidebar matching your design
- **`main-layout.tsx`** - Main layout wrapper with sidebar

### 5. Pages
- **`app/login/page.tsx`** - Google OAuth login page
- **`app/dashboard/page.tsx`** - Protected dashboard page
- **`app/page.tsx`** - Home page (redirects to login/dashboard)

### 6. Route Protection
- **`components/protected-route.tsx`** - HOC for protecting routes
- **`middleware.ts`** - Next.js middleware for route handling

## API Integration

The authentication system is configured to work with your backend API:

### Endpoints Used:
- `GET /api/v1/auth/login` - Initiate Google OAuth
- `GET /api/v1/auth/callback?code=...` - Handle OAuth callback
- `GET /api/v1/auth/session` - Get current session
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/signout` - Sign out

### Environment Variables

Make sure your `.env` file has:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Usage Examples

### Using Authentication in Components

```typescript
"use client"

import { useAuth } from "@/hooks/use-auth"

export function MyComponent() {
  const { user, isAuthenticated, login, signOut } = useAuth()

  if (!isAuthenticated) {
    return <button onClick={login}>Sign In</button>
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protecting Routes

```typescript
import { ProtectedRoute } from "@/components/protected-route"

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

### Using the Layout

```typescript
import { MainLayout } from "@/components/layout/main-layout"

export default function DashboardPage() {
  return (
    <MainLayout>
      <h1>Dashboard Content</h1>
    </MainLayout>
  )
}
```

## Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. Redirects to backend `/api/v1/auth/login`
3. Backend redirects to Google OAuth
4. Google redirects back to `/api/v1/auth/callback?code=...`
5. Backend processes callback and redirects to frontend `/login?code=...`
6. Frontend `handleCallback()` processes the code
7. User is redirected to `/dashboard`

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env` with your API URL

3. **Test the login flow:**
   - Start your backend server
   - Run `npm run dev`
   - Navigate to `http://localhost:3000`
   - You should be redirected to login
   - Click "Sign in with Google"

4. **Customize the design:**
   - Update colors in `tailwind.config.ts`
   - Modify sidebar navigation in `components/layout/sidebar.tsx`
   - Adjust dashboard layout in `app/dashboard/page.tsx`

## Code Quality

- ✅ ESLint configured
- ✅ Prettier configured with Tailwind plugin
- ✅ TypeScript strict mode enabled
- ✅ All types generated from Prisma schema
- ✅ No linter errors

## Available Scripts

- `npm run dev` - Start development server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Type check without emitting

