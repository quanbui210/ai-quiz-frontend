# Setup Complete! 🎉

Your Next.js application has been successfully set up with all the requested technologies.

## Next Steps

### 1. Install Dependencies

Run the following command to install all dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server

```bash
npm run dev
```

## Project Structure Overview

```
quiz-nextjs-frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   └── button.tsx    # Example button component
│   └── providers.tsx     # SWR and other providers
│
├── lib/                   # Utility libraries
│   ├── api/              # API configuration
│   │   ├── client.ts     # Axios client with interceptors
│   │   ├── fetcher.ts    # SWR fetcher functions
│   │   └── mutations.ts  # Mutation helpers (POST, PUT, etc.)
│   ├── utils.ts          # Utility functions (cn, etc.)
│   ├── swr-config.ts     # SWR global configuration
│   ├── constants.ts      # App constants
│   └── errors.ts         # Custom error classes
│
├── stores/                # Zustand state management
│   └── use-app-store.ts  # App-wide state store
│
├── hooks/                 # Custom React hooks
│   ├── use-api.ts        # SWR-based data fetching hook
│   └── use-mutation.ts   # Mutation hook for POST/PUT/DELETE
│
└── types/                 # TypeScript definitions
    └── index.ts          # Global type definitions
```

## Usage Examples

### Using SWR for Data Fetching

```typescript
import { useAPI } from "@/hooks/use-api"

function UserProfile() {
  const { data, error, isLoading } = useAPI<User>("/users/me")

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{data?.name}</div>
}
```

### Using Mutations

```typescript
import { useMutation } from "@/hooks/use-mutation"

function CreateUser() {
  const { mutate, isLoading, error } = useMutation<User>("post", {
    onSuccess: (data) => {
      console.log("User created:", data)
    },
    onError: (error) => {
      console.error("Error:", error)
    },
  })

  const handleSubmit = async () => {
    try {
      await mutate("/users", { name: "John", email: "john@example.com" })
    } catch (err) {
      // Error is already handled by onError
    }
  }

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create User"}
    </button>
  )
}
```

### Using Zustand Store

```typescript
import { useAppStore } from "@/stores/use-app-store"

function MyComponent() {
  // Access state
  const user = useAppStore((state) => state.user)
  
  // Access actions
  const setUser = useAppStore((state) => state.setUser)

  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={() => setUser({ id: "1", name: "John" })}>
        Set User
      </button>
    </div>
  )
}
```

### Using shadcn/ui Components

```typescript
import { Button } from "@/components/ui/button"

function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}
```

## Adding More shadcn/ui Components

To add more components from shadcn/ui:

```bash
npx shadcn-ui@latest add [component-name]
```

Popular components to add:
- `card` - Card container
- `input` - Input field
- `dialog` - Modal dialog
- `dropdown-menu` - Dropdown menu
- `toast` - Toast notifications
- `form` - Form components

## API Integration

When you're ready to add your API endpoints:

1. **Update `lib/constants.ts`** with your endpoint paths
2. **Add types** in `types/index.ts` for your API responses
3. **Use `useAPI` hook** for GET requests
4. **Use `useMutation` hook** for POST/PUT/DELETE requests

## Type Safety

All API calls are typed. Make sure to:

1. Define your types in `types/index.ts`
2. Use generics in hooks: `useAPI<User>("/users/me")`
3. Type your Zustand store state

## Need Help?

- Check the [README.md](./README.md) for more details
- Review the example code in the hooks and stores directories
- shadcn/ui docs: https://ui.shadcn.com
- SWR docs: https://swr.vercel.app
- Zustand docs: https://zustand-demo.pmnd.rs

